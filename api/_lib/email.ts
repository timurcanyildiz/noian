/* eslint-disable @typescript-eslint/no-explicit-any */

function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
}

function buildOrderEmailHtml(order: any, brandName: string): string {
  const items = (order.items ?? [])
    .map(
      (it: any) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #F3EBDD;">
            ${it.productName}${it.sizeLabel ? ` <span style="color:#6B5B4D">(${it.sizeLabel})</span>` : ""} × ${it.quantity}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #F3EBDD;text-align:right;">
            ${formatPrice(it.unitPrice * it.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  const addr = order.shippingAddress ?? {};

  return `<!DOCTYPE html>
<html lang="tr">
<body style="margin:0;font-family:Georgia,serif;background:#FAF6EF;color:#4A3F35;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#B5654A;">${brandName}</p>
    <h1 style="font-size:28px;font-weight:500;margin:8px 0 4px;">Teşekkür ederiz!</h1>
    <p style="color:#6B5B4D;line-height:1.6;">Siparişiniz başarıyla alındı. Çantanız özenle hazırlanacak.</p>
    <p style="margin:20px 0;padding:12px 16px;background:#F3EBDD;border-radius:12px;font-size:15px;">
      Sipariş No: <strong>${order.orderNumber}</strong>
    </p>
    <h2 style="font-size:18px;margin:24px 0 8px;">Sipariş özeti</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${items}
      <tr>
        <td style="padding:10px 0;color:#6B5B4D;">Kargo</td>
        <td style="padding:10px 0;text-align:right;">${order.shippingCost === 0 ? "Ücretsiz" : formatPrice(order.shippingCost)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-weight:bold;">Toplam</td>
        <td style="padding:10px 0;text-align:right;font-weight:bold;">${formatPrice(order.total)}</td>
      </tr>
    </table>
    <h2 style="font-size:18px;margin:24px 0 8px;">Teslimat</h2>
    <p style="font-size:14px;line-height:1.7;color:#6B5B4D;">
      ${addr.fullName ?? ""}<br/>
      ${addr.addressLine ?? ""}<br/>
      ${addr.district ?? ""} / ${addr.city ?? ""}<br/>
      ${addr.phone ?? ""}
    </p>
    <p style="margin-top:32px;font-size:12px;color:#6B5B4D;">Bu e-posta sipariş onayınız içindir.</p>
  </div>
</body>
</html>`;
}

/** Resend ile sipariş onay e-postası gönderir. API anahtarı yoksa sessizce atlar. */
export async function sendOrderConfirmationEmail(
  order: any,
  brandName = "Noian Bags",
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY tanımlı değil" };

  const from =
    process.env.ORDER_FROM_EMAIL || "Noian Bags <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: order.email,
        subject: `Siparişiniz alındı — ${order.orderNumber}`,
        html: buildOrderEmailHtml(order, brandName),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { sent: false, error: err };
    }
    return { sent: true };
  } catch (e) {
    console.error("Email send failed:", e);
    return { sent: false, error: String(e) };
  }
}
