/**
 * Kategoriler API'si.
 *  GET    /api/categories        -> tüm kategoriler
 *  POST   /api/categories        -> oluştur (admin)
 *  PUT    /api/categories        -> güncelle (admin)
 *  DELETE /api/categories?id=...  -> sil (admin)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./_lib/db";
import { rowToCategory } from "./_lib/schema";
import { readBody, requireAdmin, sendError } from "./_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql();

  if (req.method === "GET") {
    const rows = (await sql`SELECT * FROM categories ORDER BY name`) as any[];
    return res.status(200).json(rows.map(rowToCategory));
  }

  if (!(await requireAdmin(req, res))) return;

  if (req.method === "POST" || req.method === "PUT") {
    const c = readBody<any>(req);
    if (!c.id || !c.slug || !c.name)
      return sendError(res, 400, "id, slug ve name zorunludur.");
    await sql`
      INSERT INTO categories (id, slug, name, description)
      VALUES (${c.id}, ${c.slug}, ${c.name}, ${c.description ?? null})
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        description = EXCLUDED.description;
    `;
    const rows = (await sql`SELECT * FROM categories WHERE id = ${c.id}`) as any[];
    return res.status(200).json(rowToCategory(rows[0]));
  }

  if (req.method === "DELETE") {
    const id = req.query.id as string | undefined;
    if (!id) return sendError(res, 400, "id gerekli.");
    await sql`DELETE FROM categories WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return sendError(res, 405, "Bu yöntem desteklenmiyor.");
}
