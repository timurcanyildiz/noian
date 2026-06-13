/**
 * Müşteri yorumları API'si.
 *  GET    /api/testimonials        -> tümü
 *  POST   /api/testimonials        -> oluştur (admin)
 *  PUT    /api/testimonials        -> güncelle (admin)
 *  DELETE /api/testimonials?id=...  -> sil (admin)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./_lib/db";
import { rowToTestimonial } from "./_lib/schema";
import { readBody, requireAdmin, sendError } from "./_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql();

  if (req.method === "GET") {
    const rows = (await sql`SELECT * FROM testimonials ORDER BY id`) as any[];
    return res.status(200).json(rows.map(rowToTestimonial));
  }

  if (!(await requireAdmin(req, res))) return;

  if (req.method === "POST" || req.method === "PUT") {
    const t = readBody<any>(req);
    if (!t.id || !t.authorName || !t.text)
      return sendError(res, 400, "id, authorName ve text zorunludur.");
    await sql`
      INSERT INTO testimonials (id, author_name, location, rating, text)
      VALUES (${t.id}, ${t.authorName}, ${t.location ?? null}, ${t.rating ?? 5}, ${t.text})
      ON CONFLICT (id) DO UPDATE SET
        author_name = EXCLUDED.author_name,
        location = EXCLUDED.location,
        rating = EXCLUDED.rating,
        text = EXCLUDED.text;
    `;
    const rows = (await sql`SELECT * FROM testimonials WHERE id = ${t.id}`) as any[];
    return res.status(200).json(rowToTestimonial(rows[0]));
  }

  if (req.method === "DELETE") {
    const id = req.query.id as string | undefined;
    if (!id) return sendError(res, 400, "id gerekli.");
    await sql`DELETE FROM testimonials WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return sendError(res, 405, "Bu yöntem desteklenmiyor.");
}
