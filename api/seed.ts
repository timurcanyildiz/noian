/**
 * Şemayı oluşturur ve (boşsa) demo verilerle doldurur.
 * Yalnızca admin çağırabilir. Admin panelindeki "Veritabanını Kur" düğmesi
 * bu uca istek atar.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql, isDbConfigured } from "./_lib/db.js";
import { ensureSchema, defaultSettings } from "./_lib/schema.js";
import { requireAdmin, sendError, methodNotAllowed } from "./_lib/http.js";
import { products } from "../src/data/products.js";
import { categories } from "../src/data/categories.js";
import { testimonials } from "../src/data/testimonials.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (!(await requireAdmin(req, res))) return;
  if (!isDbConfigured())
    return sendError(res, 500, "DATABASE_URL tanımlı değil.");

  const sql = getSql();
  await ensureSchema();

  const force = (req.query.force as string) === "1";

  const [{ count: catCount }] = (await sql`SELECT count(*)::int AS count FROM categories`) as { count: number }[];
  if (force || catCount === 0) {
    for (const c of categories) {
      await sql`
        INSERT INTO categories (id, slug, name, description)
        VALUES (${c.id}, ${c.slug}, ${c.name}, ${c.description ?? null})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const [{ count: prodCount }] = (await sql`SELECT count(*)::int AS count FROM products`) as { count: number }[];
  if (force || prodCount === 0) {
    for (const p of products) {
      await sql`
        INSERT INTO products (
          id, slug, name, short_description, description, price, compare_at_price,
          category_id, images, materials, dimensions, sizes, in_stock, stock_count,
          is_featured, is_new, care_instructions, created_at
        ) VALUES (
          ${p.id}, ${p.slug}, ${p.name}, ${p.shortDescription}, ${p.description},
          ${p.price}, ${p.compareAtPrice ?? null}, ${p.categoryId},
          ${JSON.stringify(p.images)}, ${JSON.stringify(p.materials)},
          ${p.dimensions ?? null}, ${JSON.stringify(p.sizes ?? [])},
          ${p.inStock}, ${p.stockCount ?? null},
          ${p.isFeatured ?? false}, ${p.isNew ?? false},
          ${p.careInstructions ?? null}, ${p.createdAt}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const [{ count: tCount }] = (await sql`SELECT count(*)::int AS count FROM testimonials`) as { count: number }[];
  if (force || tCount === 0) {
    for (const t of testimonials) {
      await sql`
        INSERT INTO testimonials (id, author_name, location, rating, text)
        VALUES (${t.id}, ${t.authorName}, ${t.location ?? null}, ${t.rating}, ${t.text})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  await sql`
    INSERT INTO settings (id, data)
    VALUES (1, ${JSON.stringify(defaultSettings)})
    ON CONFLICT (id) DO NOTHING;
  `;

  res.status(200).json({ ok: true, message: "Veritabanı hazır ve dolduruldu." });
}
