import { useState } from "react";
import { Mail, Phone, Instagram, MapPin, CheckCircle2 } from "lucide-react";
import { FormField, validators } from "@/components/FormField";
import { OwnerNote } from "@/components/common";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

export function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Record<string, string> = {};
    n.name = validators.required(form.name) ?? "";
    n.email = validators.email(form.email) ?? "";
    n.message = validators.minLen(10)(form.message) ?? "";
    const cleaned = Object.fromEntries(Object.entries(n).filter(([, v]) => v));
    setErrors(cleaned);
    if (Object.keys(cleaned).length) return;
    // ⚠️ DEMO: Mesaj gönderimi backend gerektirir. Şimdilik sadece onay gösterilir.
    setSent(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="border-b border-cream-200 bg-cream-50">
        <div className="container py-12">
          <h1 className="text-3xl sm:text-4xl">İletişim</h1>
          <p className="mt-3 max-w-2xl text-cocoa-400">
            Sorularınız, özel sipariş istekleriniz veya sadece merhaba demek için
            bize yazın.
          </p>
        </div>
      </div>

      <div className="container grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <div className="flex flex-col gap-4">
            <ContactRow icon={Mail} label="E-posta" value={settings.contact.email} href={`mailto:${settings.contact.email}`} />
            <ContactRow icon={Phone} label="Telefon" value={settings.contact.phone} href={`tel:${settings.contact.phone.replace(/\s/g, "")}`} />
            <ContactRow icon={Instagram} label="Instagram" value="@noianbags" href={settings.contact.instagram} />
            <ContactRow icon={MapPin} label="Konum" value={settings.contact.addressShort} />
          </div>
          <OwnerNote>
            Yukarıdaki iletişim bilgilerini <strong>Yönetim Paneli →
            Ayarlar</strong> bölümünden düzenleyebilirsiniz.
          </OwnerNote>
        </div>

        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-sage-400" />
              <h2 className="mt-3 text-xl">Mesajınız alındı</h2>
              <p className="mt-2 text-sm text-cocoa-400">
                En kısa sürede size geri döneceğiz. Teşekkürler!
              </p>
              <p className="owner-note mt-4 text-left">
                ⚠️ <strong>Sahibine not:</strong> Form mesajının gerçekten size
                ulaşması için bir backend/e-posta servisi (örn. Supabase Edge
                Function) bağlanmalıdır.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <FormField label="Adınız" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
              <FormField label="E-posta" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required />
              <div>
                <label htmlFor="message" className="field-label">
                  Mesajınız <span className="text-clay-400">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={cn("input-field", errors.message && "is-invalid")}
                  placeholder="Size nasıl yardımcı olabiliriz?"
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full">
                Gönder
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-xl border border-cream-200 bg-cream-50 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-clay-50 text-clay-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-cocoa-400">{label}</p>
        <p className="font-semibold text-cocoa-600">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="hover:opacity-90">
      {content}
    </a>
  ) : (
    content
  );
}
