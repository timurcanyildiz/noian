import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Field, Input, Textarea, ImageUploader, SectionCard, Toggle } from "../components";
import type { InstagramPost, SiteSettings } from "@/data/settings";

export function SettingsAdmin() {
  const { settings, applyLocal, refresh } = useSettings();
  const { notify } = useToast();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const sync = () => setForm(settings);

  type Section = keyof SiteSettings;
  const setField = <S extends Section>(
    section: S,
    key: keyof SiteSettings[S],
    value: SiteSettings[S][keyof SiteSettings[S]],
  ) =>
    setForm((f) => ({
      ...f,
      [section]: { ...f[section], [key]: value },
    }));

  const save = async () => {
    setSaving(true);
    try {
      const saved = await api.saveSettings(form);
      applyLocal(saved);
      await refresh();
      notify("Ayarlar kaydedildi.");
    } catch (e) {
      notify((e as Error).message, "info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Ayarlar</h1>
        <button onClick={sync} className="text-sm text-cocoa-400 hover:underline">
          Sıfırla
        </button>
      </div>
      <p className="mt-1 text-cocoa-400">
        Buradaki değişiklikler tüm sitede anında geçerli olur.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <SectionCard
          title="Duyuru Şeridi"
          description="Sitenin en üstünde görünen mevsimsel / kampanya mesajı."
        >
          <div className="flex flex-col gap-4">
            <Toggle
              label="Duyuru şeridini göster"
              checked={form.banner.enabled}
              onChange={(v) => setField("banner", "enabled", v)}
            />
            <Field label="Mesaj">
              <Input
                value={form.banner.message}
                onChange={(e) => setField("banner", "message", e.target.value)}
                placeholder="Yeni koleksiyon yayında — sınırlı sayıda!"
              />
            </Field>
            <Field label="Bağlantı (opsiyonel)" hint="/magaza veya tam URL">
              <Input
                value={form.banner.link}
                onChange={(e) => setField("banner", "link", e.target.value)}
                placeholder="/magaza"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Marka & Logo">
          <div className="flex flex-col gap-4">
            <ImageUploader
              label="Logo"
              value={form.brand.logoUrl}
              onChange={(url) => setField("brand", "logoUrl", url)}
            />
            <Field label="Marka Adı">
              <Input
                value={form.brand.name}
                onChange={(e) => setField("brand", "name", e.target.value)}
              />
            </Field>
            <Field label="Slogan">
              <Input
                value={form.brand.tagline}
                onChange={(e) => setField("brand", "tagline", e.target.value)}
              />
            </Field>
            <Field label="Kısa Tanıtım (alt bilgide görünür)">
              <Textarea
                rows={3}
                value={form.brand.description}
                onChange={(e) =>
                  setField("brand", "description", e.target.value)
                }
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Ana Sayfa Metinleri">
          <div className="flex flex-col gap-4">
            <ImageUploader
              label="Hero Görseli (ana sayfa sağdaki büyük fotoğraf)"
              value={form.home.heroImageUrl}
              onChange={(url) => setField("home", "heroImageUrl", url)}
            />
            <Field label="Başlık (Hero — üst satır)">
              <Input
                value={form.home.heroTitle}
                onChange={(e) => setField("home", "heroTitle", e.target.value)}
              />
            </Field>
            <Field label="Başlık vurgusu (italik alt satır)">
              <Input
                value={form.home.heroTitleEmphasis}
                onChange={(e) =>
                  setField("home", "heroTitleEmphasis", e.target.value)
                }
                placeholder="el emeği çantalar"
              />
            </Field>
            <Field label="Alt Başlık">
              <Textarea
                rows={2}
                value={form.home.heroSubtitle}
                onChange={(e) =>
                  setField("home", "heroSubtitle", e.target.value)
                }
              />
            </Field>
            <Field label="Hikaye Metni">
              <Textarea
                rows={3}
                value={form.home.aboutText}
                onChange={(e) => setField("home", "aboutText", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title="Instagram Galerisi"
          description="Ana sayfada gösterilecek atölye kareleri (en fazla 6)."
        >
          <div className="flex flex-col gap-4">
            <Field label="Bölüm Başlığı">
              <Input
                value={form.home.instagramTitle}
                onChange={(e) =>
                  setField("home", "instagramTitle", e.target.value)
                }
              />
            </Field>
            <Field label="Alt Metin">
              <Input
                value={form.home.instagramSubtitle}
                onChange={(e) =>
                  setField("home", "instagramSubtitle", e.target.value)
                }
              />
            </Field>
            {form.home.instagramPosts.map((post, i) => (
              <div
                key={i}
                className="rounded-xl border border-cream-300 p-4"
              >
                <ImageUploader
                  label={`Görsel ${i + 1}`}
                  value={post.imageUrl}
                  onChange={(url) => {
                    const next = [...form.home.instagramPosts];
                    next[i] = { ...next[i], imageUrl: url };
                    setField("home", "instagramPosts", next);
                  }}
                />
                <Field label="Bağlantı (opsiyonel)">
                  <Input
                    value={post.link ?? ""}
                    onChange={(e) => {
                      const next = [...form.home.instagramPosts];
                      next[i] = { ...next[i], link: e.target.value };
                      setField("home", "instagramPosts", next);
                    }}
                    placeholder="https://instagram.com/p/..."
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => {
                    const next = form.home.instagramPosts.filter(
                      (_, idx) => idx !== i,
                    );
                    setField("home", "instagramPosts", next);
                  }}
                  className="mt-2 flex items-center gap-1 text-sm font-semibold text-clay-500"
                >
                  <Trash2 className="h-4 w-4" /> Kaldır
                </button>
              </div>
            ))}
            {form.home.instagramPosts.length < 6 && (
              <button
                type="button"
                onClick={() => {
                  const next: InstagramPost[] = [
                    ...form.home.instagramPosts,
                    { imageUrl: "" },
                  ];
                  setField("home", "instagramPosts", next);
                }}
                className="btn-outline"
              >
                <Plus className="h-4 w-4" /> Görsel Ekle
              </button>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="SEO & Sosyal Önizleme"
          description="Arama motorları ve paylaşım kartları için."
        >
          <div className="flex flex-col gap-4">
            <Field label="Site Açıklaması (meta description)">
              <Textarea
                rows={3}
                value={form.seo.defaultDescription}
                onChange={(e) =>
                  setField("seo", "defaultDescription", e.target.value)
                }
              />
            </Field>
            <ImageUploader
              label="Sosyal Önizleme Görseli (OG image)"
              value={form.seo.ogImageUrl}
              onChange={(url) => setField("seo", "ogImageUrl", url)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Pazarlama & Analitik"
          description="Google Analytics ve Meta Pixel kimlikleri."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Google Analytics ID" hint="Örn. G-XXXXXXXXXX">
              <Input
                value={form.marketing.googleAnalyticsId}
                onChange={(e) =>
                  setField("marketing", "googleAnalyticsId", e.target.value)
                }
              />
            </Field>
            <Field label="Meta Pixel ID">
              <Input
                value={form.marketing.metaPixelId}
                onChange={(e) =>
                  setField("marketing", "metaPixelId", e.target.value)
                }
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="İletişim Bilgileri">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-posta">
              <Input
                value={form.contact.email}
                onChange={(e) => setField("contact", "email", e.target.value)}
              />
            </Field>
            <Field label="Telefon">
              <Input
                value={form.contact.phone}
                onChange={(e) => setField("contact", "phone", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp">
              <Input
                value={form.contact.whatsapp}
                onChange={(e) =>
                  setField("contact", "whatsapp", e.target.value)
                }
              />
            </Field>
            <Field label="Instagram (tam adres)">
              <Input
                value={form.contact.instagram}
                onChange={(e) =>
                  setField("contact", "instagram", e.target.value)
                }
              />
            </Field>
            <Field label="Şehir / Konum">
              <Input
                value={form.contact.addressShort}
                onChange={(e) =>
                  setField("contact", "addressShort", e.target.value)
                }
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title="Kargo Ayarları"
          description="Sepet ve kargo politikası bu değerleri kullanır."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ücretsiz Kargo Limiti (TL)">
              <Input
                type="number"
                value={form.shipping.freeShippingThreshold}
                onChange={(e) =>
                  setField(
                    "shipping",
                    "freeShippingThreshold",
                    Number(e.target.value),
                  )
                }
              />
            </Field>
            <Field label="Standart Kargo Ücreti (TL)">
              <Input
                type="number"
                value={form.shipping.standardCost}
                onChange={(e) =>
                  setField("shipping", "standardCost", Number(e.target.value))
                }
              />
            </Field>
            <Field label="Tahmini Teslimat Süresi">
              <Input
                value={form.shipping.estimatedDays}
                onChange={(e) =>
                  setField("shipping", "estimatedDays", e.target.value)
                }
              />
            </Field>
            <Field label="Kargo Notu">
              <Input
                value={form.shipping.carrierNote}
                onChange={(e) =>
                  setField("shipping", "carrierNote", e.target.value)
                }
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title="Yasal / Şirket Bilgileri"
          description="Mesafeli satış sözleşmesi ve ön bilgilendirme formunda kullanılır."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Şirket / Satıcı Unvanı">
              <Input
                value={form.legal.companyTitle}
                onChange={(e) =>
                  setField("legal", "companyTitle", e.target.value)
                }
              />
            </Field>
            <Field label="Vergi Dairesi">
              <Input
                value={form.legal.taxOffice}
                onChange={(e) =>
                  setField("legal", "taxOffice", e.target.value)
                }
              />
            </Field>
            <Field label="Vergi / TC Kimlik No">
              <Input
                value={form.legal.taxNumber}
                onChange={(e) =>
                  setField("legal", "taxNumber", e.target.value)
                }
              />
            </Field>
            <Field label="MERSİS No (opsiyonel)">
              <Input
                value={form.legal.mersisNo}
                onChange={(e) => setField("legal", "mersisNo", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Açık Adres">
                <Textarea
                  rows={2}
                  value={form.legal.address}
                  onChange={(e) =>
                    setField("legal", "address", e.target.value)
                  }
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-cream-200 bg-cream-100/95 px-4 py-4 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-3xl justify-end">
          <button onClick={save} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? "Kaydediliyor…" : "Tüm Ayarları Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
