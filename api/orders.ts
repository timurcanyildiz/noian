/**
 * Siparişler API'si.
 *  GET  /api/orders                 -> tüm siparişler (admin)
 *  GET  /api/orders?email=...       -> e-postaya göre (müşteri kendi siparişleri)
 *  GET  /api/orders?number=...      -> sipariş no ile tek sipariş
 *  POST /api/orders                 -> sipariş oluştur (herkese açık / misafir)
 *  PUT  /api/orders                 -> durum güncelle (admin)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./_lib/db.js";
import { rowToOrder } from "./_lib/schema.js";
import { readBody, requireAdmin, sendError } from "./_lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql();

  if (req.method === "GET") {
    const number = req.query.number as string | undefined;
    const email = req.query.email as string | undefined;

    if (number) {
      const rows = (await sql`SELECT * FROM orders WHERE order_number = ${number} LIMIT 1`) as any[];
      if (!rows.length) return sendError(res, 404, "Sipariş bulunamadı.");
      return res.status(200).json(rowToOrder(rows[0]));
    }
    if (email) {
      const rows = (await sql`SELECT * FROM orders WHERE email = ${email} ORDER BY created_at DESC`) as any[];
      return res.status(200).json(rows.map(rowToOrder));
    }
    // Tüm siparişler -> admin
    if (!(await requireAdmin(req, res))) return;
    const rows = (await sql`SELECT * FROM orders ORDER BY created_at DESC`) as any[];
    return res.status(200).json(rows.map(rowToOrder));
  }

  if (req.method === "POST") {
    const o = readBody<any>(req);
    if (!o.id || !o.orderNumber || !o.email)
      return sendError(res, 400, "Sipariş bilgileri eksik.");
    await sql`
      INSERT INTO orders (
        id, order_number, user_id, email, items, shipping_address,
        subtotal, shipping_cost, total, status, payment_method, payment_status,
        note, created_at
      ) VALUES (
        ${o.id}, ${o.orderNumber}, ${o.userId ?? null}, ${o.email},
        ${JSON.stringify(o.items ?? [])}, ${JSON.stringify(o.shippingAddress)},
        ${o.subtotal ?? 0}, ${o.shippingCost ?? 0}, ${o.total ?? 0},
        ${o.status ?? "beklemede"}, ${o.paymentMethod ?? "shopier"},
        ${o.paymentStatus ?? "beklemede"}, ${o.note ?? null},
        ${o.createdAt ?? new Date().toISOString()}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    return res.status(201).json({ ok: true });
  }

  if (req.method === "PUT") {
    if (!(await requireAdmin(req, res))) return;
    const { id, status } = readBody<{ id?: string; status?: string }>(req);
    if (!id || !status) return sendError(res, 400, "id ve status gerekli.");
    await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
    const rows = (await sql`SELECT * FROM orders WHERE id = ${id}`) as any[];
    return res.status(200).json(rowToOrder(rows[0]));
  }

  res.setHeader("Allow", "GET, POST, PUT");
  return sendError(res, 405, "Bu yöntem desteklenmiyor.");
}
