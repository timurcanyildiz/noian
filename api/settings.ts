/**
 * Site ayarları API'si (logo, marka, iletişim, kargo, ana sayfa metinleri).
 *  GET /api/settings   -> ayarları getir (herkese açık)
 *  PUT /api/settings   -> ayarları güncelle (admin)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./_lib/db.js";
import { defaultSettings } from "./_lib/schema.js";
import { readBody, requireAdmin, sendError } from "./_lib/http.js";

function mergeSettings(stored: Record<string, unknown> | null | undefined) {
  const s = stored ?? {};
  return {
    brand: { ...defaultSettings.brand, ...(s.brand as object) },
    contact: { ...defaultSettings.contact, ...(s.contact as object) },
    shipping: { ...defaultSettings.shipping, ...(s.shipping as object) },
    legal: { ...defaultSettings.legal, ...(s.legal as object) },
    banner: { ...defaultSettings.banner, ...(s.banner as object) },
    marketing: { ...defaultSettings.marketing, ...(s.marketing as object) },
    seo: { ...defaultSettings.seo, ...(s.seo as object) },
    home: {
      ...defaultSettings.home,
      ...(s.home as object),
      instagramPosts:
        (s.home as { instagramPosts?: unknown[] })?.instagramPosts ??
        defaultSettings.home.instagramPosts,
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql();

  if (req.method === "GET") {
    const rows = (await sql`SELECT data FROM settings WHERE id = 1 LIMIT 1`) as any[];
    const data = rows.length ? mergeSettings(rows[0].data) : defaultSettings;
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
