import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { getPrimaryImage } from "@/data/products";

export function ProductsAdmin() {
  const { products, categories, refresh, loading } = useCatalog();
  const { notify } = useToast();
  const [q, setQ] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );

  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const remove = async (id: string) => {
    await api.deleteProduct(id);
    await refresh();
    setConfirmId(null);
    notify("Ürün silindi.");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Ürünler</h1>
          <p className="mt-1 text-cocoa-400">{products.length} ürün</p>
        </div>
        <Link to="/admin/urunler/yeni" className="btn-primary">
          <Plus className="h-4 w-4" /> Yeni Ürün
        </Link>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ürün ara…"
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <p className="mt-8 text-center text-cocoa-400">Yükleniyor…</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {filtered.map((p) => {
            const img = getPrimaryImage(p);
            return (
              <div key={p.id} className="card flex items-center gap-4 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                  {img && (
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cocoa-600">
                    {p.name}
                  </p>
                  <p className="text-sm text-cocoa-400">
                    {catName(p.categoryId)} · {formatPrice(p.price)} ·{" "}
                    {p.inStock ? (
                      <span className="text-sage-400">Stokta</span>
                    ) : (
                      <span className="text-clay-500">Tükendi</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/urunler/${p.id}`}
                    className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200"
                    aria-label="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200 hover:text-clay-500"
                    aria-label="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="card p-8 text-center text-cocoa-400">
              Ürün bulunamadı.
            </p>
          )}
        </div>
      )}

      {/* Silme onayı */}
      {confirmId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa-700/40 p-4">
          <div className="card max-w-sm p-6 text-center">
            <h3 className="text-xl">Ürünü sil?</h3>
            <p className="mt-2 text-sm text-cocoa-400">
              Bu işlem geri alınamaz.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="btn-outline flex-1"
              >
                Vazgeç
              </button>
              <button
                onClick={() => remove(confirmId)}
                className="btn-primary flex-1 bg-red-500 hover:bg-red-600"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
