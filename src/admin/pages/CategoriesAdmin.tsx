import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Save, Trash2, Pencil, ChevronDown, Package } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { slugify, generateId, cn, formatPrice } from "@/lib/utils";
import { getPrimaryImage } from "@/data/products";
import { Field, Input, Textarea } from "../components";
import type { Category } from "@/data/types";

export function CategoriesAdmin() {
  const { categories, products, refresh } = useCatalog();
  const { notify } = useToast();
  const [editing, setEditing] = useState<Category | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const blank = (): Category => ({
    id: generateId("cat"),
    slug: "",
    name: "",
    description: "",
  });

  const productsInCategory = (categoryId: string) =>
    products.filter((p) => p.categoryId === categoryId);

  const uncategorized = products.filter(
    (p) => !p.categoryId || !categories.some((c) => c.id === p.categoryId),
  );

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const save = async (c: Category) => {
    if (!c.name.trim()) return notify("Kategori adı zorunlu.", "info");
    await api.saveCategory({ ...c, slug: c.slug || slugify(c.name) });
    await refresh();
    setEditing(null);
    notify("Kategori kaydedildi.");
  };

  const remove = async (id: string) => {
    const count = productsInCategory(id).length;
    if (count > 0) {
      notify(
        `Bu kategoride ${count} ürün var. Önce ürünleri başka kategoriye taşıyın.`,
        "info",
      );
      return;
    }
    await api.deleteCategory(id);
    await refresh();
    notify("Kategori silindi.");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Kategoriler</h1>
          <p className="mt-1 text-cocoa-400">
            {categories.length} kategori · {products.length} ürün
          </p>
        </div>
        <button onClick={() => setEditing(blank())} className="btn-primary">
          <Plus className="h-4 w-4" /> Yeni Kategori
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {categories.map((c) => {
          const catProducts = productsInCategory(c.id);
          const isOpen = expanded[c.id] ?? true;

          return (
            <div key={c.id} className="card overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() => toggleExpanded(c.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200"
                  aria-label={isOpen ? "Ürünleri gizle" : "Ürünleri göster"}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-cocoa-600">{c.name}</p>
                  <p className="text-sm text-cocoa-400">
                    /{c.slug} · {catProducts.length} ürün
                  </p>
                  {c.description && (
                    <p className="mt-1 text-sm text-cocoa-500">{c.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setEditing(c)}
                  className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200"
                  aria-label="Düzenle"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200 hover:text-clay-500"
                  aria-label="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-cream-200 bg-cream-50/50 px-4 py-3">
                  {catProducts.length === 0 ? (
                    <p className="py-2 text-center text-sm text-cocoa-400">
                      Bu kategoride henüz ürün yok.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {catProducts.map((p) => {
                        const img = getPrimaryImage(p);
                        return (
                          <li key={p.id}>
                            <Link
                              to={`/admin/urunler/${p.id}`}
                              className="flex items-center gap-3 rounded-xl border border-cream-200 bg-cream-50 p-2 transition-colors hover:border-clay-200 hover:bg-cream-100"
                            >
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                                {img ? (
                                  <img
                                    src={img.url}
                                    alt={img.alt}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="grid h-full w-full place-items-center text-cocoa-400">
                                    <Package className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-cocoa-600">
                                  {p.name}
                                </p>
                                <p className="text-xs text-cocoa-400">
                                  {formatPrice(p.price)} ·{" "}
                                  {p.inStock ? "Stokta" : "Tükendi"}
                                </p>
                              </div>
                              <Pencil className="h-4 w-4 shrink-0 text-clay-400" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {uncategorized.length > 0 && (
          <div className="card overflow-hidden border-dashed border-clay-200">
            <div className="flex items-center gap-3 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay-50 text-clay-400">
                <Package className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-cocoa-600">Kategorisiz Ürünler</p>
                <p className="text-sm text-cocoa-400">
                  {uncategorized.length} ürün — kategori atanmamış
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-2 border-t border-cream-200 bg-cream-50/50 px-4 py-3">
              {uncategorized.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/admin/urunler/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm font-medium text-cocoa-600 hover:border-clay-200"
                  >
                    {p.name}
                    <Pencil className="h-4 w-4 text-clay-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa-700/40 p-4">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-xl">
              {categories.some((c) => c.id === editing.id)
                ? "Kategoriyi Düzenle"
                : "Yeni Kategori"}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Ad">
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      name: e.target.value,
                      slug: editing.slug || slugify(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Bağlantı (slug)">
                <Input
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: slugify(e.target.value) })
                  }
                />
              </Field>
              <Field label="Açıklama">
                <Textarea
                  rows={2}
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setEditing(null)} className="btn-outline flex-1">
                Vazgeç
              </button>
              <button onClick={() => save(editing)} className="btn-primary flex-1">
                <Save className="h-4 w-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
