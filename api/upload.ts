/**
 * Görsel yükleme (logo / ürün fotoğrafı) — Vercel Blob.
 *  POST /api/upload  { filename, dataUrl }  (admin)
 *  -> { url }
 *
 *  Not: İstemci, dosyayı base64 "data URL" olarak gönderir. Vercel serverless
 *  gövde sınırı ~4.5MB olduğundan büyük fotoğrafları yüklemeden önce küçültün.
 *  BLOB_READ_WRITE_TOKEN, Vercel'de Blob deposu bağlandığında otomatik gelir.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { readBody, requireAdmin, sendError } from "./_lib/http.js";

export const config = {
  api: { bodyParser: { sizeLimit: "6mb" } },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendError(res, 405, "Bu yöntem desteklenmiyor.");
  }
  if (!(await requireAdmin(req, res))) return;

  // Vercel Blob: eski token (BLOB_READ_WRITE_TOKEN) veya yeni OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN)
  const hasBlob =
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID;
  if (!hasBlob) {
    return sendError(
      res,
      500,
      "Vercel Blob bağlı değil. Vercel panelinden Storage → Blob oluşturup bu projeye bağlayın.",
    );
  }

  const { filename, dataUrl } = readBody<{
    filename?: string;
    dataUrl?: string;
  }>(req);

  if (!dataUrl || !filename)
    return sendError(res, 400, "filename ve dataUrl gerekli.");

  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) return sendError(res, 400, "Geçersiz dosya verisi.");

  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  try {
    const blob = await put(safeName, buffer, {
      access: "public",
      contentType,
    });
    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("Blob upload failed:", err);
    return sendError(
      res,
      500,
      "Görsel yüklenemedi. Blob deposunun projeye bağlı olduğundan emin olun ve yeniden deploy edin.",
    );
  }
}
