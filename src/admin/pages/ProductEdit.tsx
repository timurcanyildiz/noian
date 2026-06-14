import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus, Save, Star, Trash2 } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { slugify, generateId, cn } from "@/lib/utils";
import { Field, Input, Textarea, Toggle, ImageUploader } from "../components";
import type { Product, ProductImage, ProductSize } from "@/data/types";

const empty = (): Product => ({
  id: generateId("p"),
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  price: 0,
  categoryId: "",
  images: [],
  materials: [],
  inStock: true,
  stockCount: 1,
  isFeatured: false,
  isNew: true,
  createdAt: new Date().toISOString(),
});

export function ProductEdit() {
  const { id } = useParams();
  const isNew = !id || id === "yeni";
  const navigate = useNavigate();
  const { products, categories, refresh } = useCatalog();
  const { notify } = useToast();

  const existing = useMemo(
    () => (isNew ? undefined : products.find((p) => p.id === id)),
    [isNew, id, products],
  );

  const [form, setForm] = useState<Product>(empty);
  const [slugEdited, setSlugEdited] = useState(false);
  const [materialsText, setMaterialsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm(existing);
      setMaterialsText(existing.materials.join(", "));
      setSlugEdited(true);
    }
  }, [existing]);

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugEdited ? f.slug : slugify(name),
    }));
  };

  // ---- Görseller ----
  const addImage = () =>
    set("images", [
      ...form.images,
      {
        id: generateId("img"),
        productId: form.id,
        url: "",
        alt: form.name,
        isPrimary: form.images.length === 0,
        sortOrder: form.images.length + 1,
      },
    ]);

  const updateImage = (i: number, patch: Partial<ProductImage>) =>
    set(
      "images",
      form.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)),
    );

  const removeImage = (i: number) =>
    set(
      "images",
      form.images.filter((_, idx) => idx !== i),
    );

  const makePrimary = (i: number) =>
    set(
      "images",
      form.images.map((img, idx) => ({ ...img, isPrimary: idx === i })),
    );

  const addSize = () =>
    set("sizes", [
      ...(form.sizes ?? []),
      {
        id: generateId("sz"),
        label: "",
        dimensions: "",
        inStock: true,
        stockCount: 1,
      },
    ]);

  const updateSize = (i: number, patch: Partial<ProductSize>) =>
    set(
      "sizes",
      (form.sizes ?? []).map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );

  const removeSize = (i: number) =>
    set(
      "sizes",
      (form.sizes ?? []).filter((_, idx) => idx !== i),
    );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      notify("Ürün adı ve bağlantı (slug) zorunludur.", "info");
      return;
    }
    if (!form.categoryId) {
      notify("Lütfen bir kategori seçin.", "info");
      return;
    }
    setSaving(true);
    const payload: Product = {
      ...form,
      materials: materialsText
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      images: form.images.filter((img) => img.url),
      sizes: (form.sizes ?? []).filter((s) => s.label.trim()),
    };
    try {
      await api.saveProduct(payload);
      await refresh();
      notify(isNew ? "Ürün eklendi." : "Ürün güncellendi.");
      navigate("/admin/urunler");
    } catch (err) {
      notify((err as Error).message, "info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl">
      <Link
        to="/admin/urunler"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-clay-400 hover:underline"
      >
        <ChevronLeft className="h-4 w-4" /> Ürünlere dön
      </Link>

      <h1 className="text-3xl">{isNew ? "Yeni Ürün" : "Ürünü Düzenle"}</h1>

      <div className="mt-6 flex flex-col gap-6">
        {/* Temel bilgiler */}
        <section className="card p-6">
          <h2 className="mb-4 text-xl">Temel Bilgiler</h2>
          <div className="flex flex-col gap-4">
            <Field label="Ürün Adı">
              <Input
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Örn. Anatolia Omuz Çantası"
              />
            </Field>
            <Field
              label="Bağlantı (slug)"
              hint="Ürün sayfasının web adresi: /urun/bu-kisim"
            >
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="anatolia-omuz-cantasi"
              />
            </Field>
            <Field label="Kısa Açıklama" hint="Ürün kartında görünür">
              <Input
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
              />
            </Field>
            <Field
              label="Kategori"
              hint={
                categories.length === 0
                  ? "Önce Kategoriler bölümünden kategori ekleyin."
                  : "Mağazada hangi koleksiyonda görüneceğini seçin."
              }
            >
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="input-field"
                required
              >
                <option value="">Kategori seçin…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Detaylı Açıklama">
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
              />
            </Field>
          </div>
        </section>

        {/* Fiyat & stok */}
        <section className="card p-6">
          <h2 className="mb-4 text-xl">Fiyat & Stok</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fiyat (TL)">
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </Field>
            <Field
              label="İndirim Öncesi Fiyat (opsiyonel)"
              hint="Doldurursanız üstü çizili gösterilir"
            >
              <Input
                type="number"
                min={0}
                value={form.compareAtPrice ?? ""}
                onChange={(e) =>
                  set(
                    "compareAtPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </Field>
            <Field label="Stok Adedi">
              <Input
                type="number"
                min={0}
                value={form.stockCount ?? 0}
                onChange={(e) => set("stockCount", Number(e.target.value))}
              />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <Toggle
              label="Stokta"
              checked={form.inStock}
              onChange={(v) => set("inStock", v)}
            />
            <Toggle
              label="Öne çıkan"
              checked={!!form.isFeatured}
              onChange={(v) => set("isFeatured", v)}
            />
            <Toggle
              label="Yeni ürün"
              checked={!!form.isNew}
              onChange={(v) => set("isNew", v)}
            />
          </div>
        </section>

        {/* Görseller */}
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">Görseller</h2>
            <button type="button" onClick={addImage} className="btn-outline">
              <Plus className="h-4 w-4" /> Görsel Ekle
            </button>
          </div>
          {form.images.length === 0 && (
            <p className="rounded-xl border border-dashed border-cream-300 p-6 text-center text-sm text-cocoa-400">
              Henüz görsel yok. "Görsel Ekle" ile ürün fotoğrafı yükleyin.
            </p>
          )}
          <div className="flex flex-col gap-4">
            {form.images.map((img, i) => (
              <div
                key={img.id}
                className={cn(
                  "rounded-xl border p-4",
                  img.isPrimary ? "border-clay-300 bg-clay-50/40" : "border-cream-300",
                )}
              >
                <ImageUploader
                  value={img.url}
                  onChange={(url) => updateImage(i, { url })}
                  label={`Görsel ${i + 1}`}
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Input
                    value={img.alt}
                    onChange={(e) => updateImage(i, { alt: e.target.value })}
                    placeholder="Görsel açıklaması (erişilebilirlik)"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold",
                      img.isPrimary
                        ? "bg-clay-400 text-cream-50"
                        : "bg-cream-200 text-cocoa-500 hover:bg-cream-300",
                    )}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {img.isPrimary ? "Kapak" : "Kapak yap"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="grid h-9 w-9 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200 hover:text-clay-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ölçü seçenekleri */}
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl">Ölçü Seçenekleri</h2>
              <p className="mt-1 text-sm text-cocoa-400">
                Aynı modelde birden fazla ölçü varsa buradan ekleyin. Boş
                bırakırsanız tek ölçülü ürün olarak kalır.
              </p>
            </div>
            <button type="button" onClick={addSize} className="btn-outline shrink-0">
              <Plus className="h-4 w-4" /> Ölçü Ekle
            </button>
          </div>

          {(form.sizes ?? []).length === 0 ? (
            <p className="rounded-xl border border-dashed border-cream-300 p-5 text-center text-sm text-cocoa-400">
              Henüz ölçü seçeneği yok. Tek ölçü için aşağıdaki &quot;Ölçüler&quot;
              alanını kullanabilirsiniz.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {(form.sizes ?? []).map((size, i) => (
                <div
                  key={size.id}
                  className="rounded-xl border border-cream-300 p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Etiket" hint='Örn. "Küçük", "Orta", "Büyük"'>
                      <Input
                        value={size.label}
                        onChange={(e) =>
                          updateSize(i, { label: e.target.value })
                        }
                        placeholder="Orta"
                      />
                    </Field>
                    <Field label="Ölçüler">
                      <Input
                        value={size.dimensions ?? ""}
                        onChange={(e) =>
                          updateSize(i, { dimensions: e.target.value })
                        }
                        placeholder="30 x 24 x 9 cm"
                      />
                    </Field>
                    <Field
                      label="Fiyat (TL)"
                      hint="Boş bırakırsanız temel fiyat kullanılır"
                    >
                      <Input
                        type="number"
                        min={0}
                        value={size.price ?? ""}
                        onChange={(e) =>
                          updateSize(i, {
                            price: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </Field>
                    <Field label="Stok">
                      <Input
                        type="number"
                        min={0}
                        value={size.stockCount ?? 0}
                        onChange={(e) =>
                          updateSize(i, {
                            stockCount: Number(e.target.value),
                          })
                        }
                      />
                    </Field>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Toggle
                      label="Stokta"
                      checked={size.inStock}
                      onChange={(v) => updateSize(i, { inStock: v })}
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      className="flex items-center gap-1 text-sm font-semibold text-clay-500 hover:underline"
                    >
                      <Trash2 className="h-4 w-4" /> Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Detaylar */}
        <section className="card p-6">
          <h2 className="mb-4 text-xl">Detaylar</h2>
          <div className="flex flex-col gap-4">
            <Field label="Malzemeler" hint="Virgülle ayırın: Pamuk, Keten, Pirinç toka">
              <Input
                value={materialsText}
                onChange={(e) => setMaterialsText(e.target.value)}
              />
            </Field>
            <Field
              label="Ölçüler (tek ölçü)"
              hint={
                (form.sizes?.length ?? 0) > 0
                  ? "Çoklu ölçü tanımlıysa bu alan kullanılmaz."
                  : undefined
              }
            >
              <Input
                value={form.dimensions ?? ""}
                onChange={(e) => set("dimensions", e.target.value)}
                placeholder="30 x 24 x 9 cm"
                disabled={(form.sizes?.length ?? 0) > 0}
              />
            </Field>
            <Field label="Bakım Talimatı">
              <Input
                value={form.careInstructions ?? ""}
                onChange={(e) => set("careInstructions", e.target.value)}
                placeholder="30°C'de elde yıkayınız."
              />
            </Field>
          </div>
        </section>
      </div>

      {/* Kaydet çubuğu */}
      <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-cream-200 bg-cream-100/95 py-4 backdrop-blur">
        <Link to="/admin/urunler" className="btn-outline">
          Vazgeç
        </Link>
        <button type="submit" disabled={saving} className="btn-primary flex-1">
          <Save className="h-4 w-4" />
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
