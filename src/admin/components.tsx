import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Admin form etiketi + alan kabı */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-cocoa-500">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-cocoa-400">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input-field", props.className)} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn("input-field", props.className)}
      rows={props.rows ?? 4}
    />
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-clay-400" : "bg-cream-300",
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.375rem]" : "left-0.5",
          )}
        />
      </button>
      <span className="text-sm font-semibold text-cocoa-500">{label}</span>
    </label>
  );
}

/**
 * Tek görsel yükleyici. Dosyayı base64'e çevirip /api/upload'a gönderir
 * (Vercel Blob). Sunucu yoksa görseli doğrudan yerel olarak kullanır.
 */
export function ImageUploader({
  value,
  onChange,
  label = "Görsel",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const handleFile = async (file: File) => {
    setError(undefined);
    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya 5MB'tan küçük olmalı. Lütfen fotoğrafı küçültün.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const url = await api.uploadImage(file.name, dataUrl);
      onChange(url);
    } catch (e) {
      setError((e as Error).message || "Yükleme başarısız.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-cocoa-500">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-cream-300 bg-cream-100">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-cocoa-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="btn-outline"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {value ? "Değiştir" : "Yükle"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-xs font-semibold text-clay-500 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" /> Kaldır
            </button>
          )}
        </div>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <h2 className="text-xl">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-cocoa-400">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}
