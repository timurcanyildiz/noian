import { useState } from "react";
import { Plus, Save, Trash2, Pencil } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { slugify, generateId } from "@/lib/utils";
import { Field, Input, Textarea } from "../components";
import type { Category } from "@/data/types";

export function CategoriesAdmin() {
  const { categories, products, refresh } = useCatalog();
  const { notify } = useToast();
  const [editing, setEditing] = useState<Category | null>(null);

  const blank = (): Category => ({
    id: generateId("cat"),
    slug: "",
    name: "",
    description: "",
  });

  const save = async (c: Category) => {
    if (!c.name.trim()) return notify("Kategori adı zorunlu.", "info");
    await api.saveCategory({ ...c, slug: c.slug || slugify(c.name) });
    await refresh();
    setEditing(null);
    notify("Kategori kaydedildi.");
  };

  const remove = async (id: string) => {
    const count = products.filter((p) => p.categoryId === id).length;
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
        <h1 className="text-3xl">Kategoriler</h1>
        <button onClick={() => setEditing(blank())} className="btn-primary">
          <Plus className="h-4 w-4" /> Yeni Kategori
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {categories.map((c) => (
          <div key={c.id} className="card flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-semibold text-cocoa-600">{c.name}</p>
              <p className="text-sm text-cocoa-400">
                /{c.slug} ·{" "}
                {products.filter((p) => p.categoryId === c.id).length} ürün
              </p>
            </div>
            <button
              onClick={() => setEditing(c)}
              className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(c.id)}
              className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200 hover:text-clay-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
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
