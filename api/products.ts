/**
 * Ürünler API'si.
 *  GET    /api/products            -> tüm ürünler
 *  GET    /api/products?slug=...   -> tek ürün
 *  POST   /api/products            -> oluştur (admin)
 *  PUT    /api/products            -> güncelle (admin)
 *  DELETE /api/products?id=...     -> sil (admin)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./_lib/db";
import { rowToProduct } from "./_lib/schema";
import { readBody, requireAdmin, sendError } from "./_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql();

  if (req.method === "GET") {
    const slug = req.query.slug as string | undefined;
    if (slug) {
      const rows = (await sql`SELECT * FROM products WHERE slug = ${slug} LIMIT 1`) as any[];
      if (!rows.length) return sendError(res, 404, "Ürün bulunamadı.");
      return res.status(200).json(rowToProduct(rows[0]));
    }
    const rows = (await sql`SELECT * FROM products ORDER BY created_at DESC`) as any[];
    return res.status(200).json(rows.map(rowToProduct));
  }

  // Aşağıdaki işlemler admin yetkisi ister
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "POST" || req.method === "PUT") {
    const p = readBody<any>(req);
    if (!p.id || !p.slug || !p.name)
      return sendError(res, 400, "id, slug ve name zorunludur.");

    await sql`
      INSERT INTO products (
        id, slug, name, short_description, description, price, compare_at_price,
        category_id, images, materials, dimensions, in_stock, stock_count,
        is_featured, is_new, care_instructions, created_at
      ) VALUES (
        ${p.id}, ${p.slug}, ${p.name}, ${p.shortDescription ?? ""}, ${p.description ?? ""},
        ${p.price ?? 0}, ${p.compareAtPrice ?? null}, ${p.categoryId ?? null},
        ${JSON.stringify(p.images ?? [])}, ${JSON.stringify(p.materials ?? [])},
        ${p.dimensions ?? null}, ${p.inStock ?? true}, ${p.stockCount ?? null},
        ${p.isFeatured ?? false}, ${p.isNew ?? false}, ${p.careInstructions ?? null},
        ${p.createdAt ?? new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        compare_at_price = EXCLUDED.compare_at_price,
        category_id = EXCLUDED.category_id,
        images = EXCLUDED.images,
        materials = EXCLUDED.materials,
        dimensions = EXCLUDED.dimensions,
        in_stock = EXCLUDED.in_stock,
        stock_count = EXCLUDED.stock_count,
        is_featured = EXCLUDED.is_featured,
        is_new = EXCLUDED.is_new,
        care_instructions = EXCLUDED.care_instructions;
    `;
    const rows = (await sql`SELECT * FROM products WHERE id = ${p.id}`) as any[];
    return res.status(200).json(rowToProduct(rows[0]));
  }

  if (req.method === "DELETE") {
    const id = req.query.id as string | undefined;
    if (!id) return sendError(res, 400, "id gerekli.");
    await sql`DELETE FROM products WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return sendError(res, 405, "Bu yöntem desteklenmiyor.");
}
