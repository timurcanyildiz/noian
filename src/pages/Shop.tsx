import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { SeoHead } from "@/components/SeoHead";
import { useCatalog } from "@/context/CatalogContext";
import { Spinner } from "@/components/common";
import { cn } from "@/lib/utils";

type SortKey = "yeni" | "artan" | "azalan";

export function Shop() {
  const { products, categories, getCategoryBySlug, loading } = useCatalog();
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("kategori") ?? "tumu";
  const sort = (params.get("sirala") as SortKey) ?? "yeni";

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCat !== "tumu") {
      const cat = getCategoryBySlug(activeCat);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }
    if (sort === "artan") list.sort((a, b) => a.price - b.price);
    else if (sort === "azalan") list.sort((a, b) => b.price - a.price);
    else
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    return list;
  }, [activeCat, sort, products, getCategoryBySlug]);

  const setCat = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug === "tumu") next.delete("kategori");
    else next.set("kategori", slug);
    setParams(next);
  };

  return (
    <div className="animate-fade-in">
      <SeoHead
        title="Mağaza"
        description="El emeği kumaş çantalar — sınırlı sayıda, özenle üretildi."
      />
      <div className="border-b border-cream-200 bg-cream-50">
        <div className="container py-10">
          <h1 className="text-3xl sm:text-4xl">Mağaza</h1>
          <p className="mt-2 text-cocoa-400">
            Sevgiyle dikilmiş el emeği çantalarımızın tamamı.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filtre çubuğu */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <FilterChip
              label="Tümü"
              active={activeCat === "tumu"}
              onClick={() => setCat("tumu")}
            />
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                label={c.name}
                active={activeCat === c.slug}
                onClick={() => setCat(c.slug)}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="sirala" className="text-sm text-cocoa-400">
              Sırala:
            </label>
            <select
              id="sirala"
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                next.set("sirala", e.target.value);
                setParams(next);
              }}
              className="rounded-full border border-cream-300 bg-cream-50 px-4 py-2 text-sm text-cocoa-600 focus:border-clay-300 focus:outline-none"
            >
              <option value="yeni">En Yeni</option>
              <option value="artan">Fiyat: Artan</option>
              <option value="azalan">Fiyat: Azalan</option>
            </select>
          </div>
        </div>

        <p className="mb-4 text-sm text-cocoa-400">{filtered.length} ürün</p>

        {loading ? (
          <Spinner label="Ürünler yükleniyor…" />
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center text-cocoa-400">
            Bu kategoride şimdilik ürün bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-clay-400 bg-clay-400 text-cream-50"
          : "border-cream-300 bg-cream-50 text-cocoa-500 hover:border-clay-200",
      )}
    >
      {label}
    </button>
  );
}
