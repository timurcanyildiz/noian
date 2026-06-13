import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Pencil, Star } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { generateId } from "@/lib/utils";
import { Field, Input, Textarea } from "../components";
import type { Testimonial } from "@/data/types";

export function TestimonialsAdmin() {
  const { notify } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const load = () => api.listTestimonials().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const blank = (): Testimonial => ({
    id: generateId("t"),
    authorName: "",
    location: "",
    rating: 5,
    text: "",
  });

  const save = async (t: Testimonial) => {
    if (!t.authorName.trim() || !t.text.trim())
      return notify("İsim ve yorum metni zorunlu.", "info");
    await api.saveTestimonial(t);
    await load();
    setEditing(null);
    notify("Yorum kaydedildi.");
  };

  const remove = async (id: string) => {
    await api.deleteTestimonial(id);
    await load();
    notify("Yorum silindi.");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Müşteri Yorumları</h1>
        <button onClick={() => setEditing(blank())} className="btn-primary">
          <Plus className="h-4 w-4" /> Yeni Yorum
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {items.map((t) => (
          <div key={t.id} className="card flex items-start gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-cocoa-600">{t.authorName}</p>
                <span className="flex items-center gap-0.5 text-clay-300">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-clay-300" />
                  ))}
                </span>
              </div>
              <p className="mt-1 text-sm text-cocoa-500">“{t.text}”</p>
            </div>
            <button
              onClick={() => setEditing(t)}
              className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(t.id)}
              className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200 hover:text-clay-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="card p-8 text-center text-cocoa-400">Henüz yorum yok.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa-700/40 p-4">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-xl">Yorum</h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="İsim">
                <Input
                  value={editing.authorName}
                  onChange={(e) =>
                    setEditing({ ...editing, authorName: e.target.value })
                  }
                />
              </Field>
              <Field label="Konum (opsiyonel)">
                <Input
                  value={editing.location ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                />
              </Field>
              <Field label="Puan (1-5)">
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={editing.rating}
                  onChange={(e) =>
                    setEditing({ ...editing, rating: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Yorum">
                <Textarea
                  rows={3}
                  value={editing.text}
                  onChange={(e) =>
                    setEditing({ ...editing, text: e.target.value })
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
