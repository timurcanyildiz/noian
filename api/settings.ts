/**
 * Site ayarları API'si (logo, marka, iletişim, kargo, ana sayfa metinleri).
 *  GET /api/settings   -> ayarları getir (herkese açık)
 *  PUT /api/settings   -> ayarları güncelle (admin)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./_lib/db";
import { defaultSettings } from "./_lib/schema";
import { readBody, requireAdmin, sendError } from "./_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql();

  if (req.method === "GET") {
    const rows = (await sql`SELECT data FROM settings WHERE id = 1 LIMIT 1`) as any[];
    const data = rows.length ? rows[0].data : defaultSettings;
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    if (!(await requireAdmin(req, res))) return;
    const data = readBody<any>(req);
    await sql`
      INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(data)})
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
    `;
    return res.status(200).json(data);
  }

  res.setHeader("Allow", "GET, PUT");
  return sendError(res, 405, "Bu yöntem desteklenmiyor.");
}
