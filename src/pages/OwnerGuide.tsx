import { CheckCircle2, AlertTriangle, Pencil, ExternalLink } from "lucide-react";

/**
 * ============================================================================
 *  SİTE SAHİBİ REHBERİ
 * ============================================================================
 *  Bu sayfa, site sahibi (anneniz / siz) içindir. Müşteriler bu sayfaya
 *  normalde ulaşmaz (footer'da "Site Sahibi Rehberi" linki vardır).
 *  Yayına geçtiğinizde bu linki dilerseniz kaldırabilirsiniz.
 * ============================================================================
 */

const READY = [
  "Ana sayfa, mağaza, ürün detay, sepet ve ödeme akışı",
  "Türkçe arayüz ve sıcak, el emeği butik tasarımı",
  "Mobil uyumlu menü ve alt sabit aksiyon çubukları",
  "Yönetim paneli: ürün/kategori/yorum/sipariş/ayar yönetimi",
  "Logo ve ürün fotoğrafı yükleme (Vercel Blob ile)",
  "Sepetin tarayıcıda kalıcı olması (sayfa kapansa bile)",
  "Üyelik / giriş / şifremi unuttum akışları (demo)",
  "Misafir (üyeliksiz) sipariş verebilme",
  "Sipariş onayı / teşekkür sayfası",
  "Kargo, iade, gizlilik ve sözleşme sayfası taslakları",
  "Veritabanı bağlı değilken bile çalışan demo modu",
];

const EXTERNAL = [
  {
    title: "Veritabanı (Neon Postgres)",
    detail:
      "Vercel → Storage'dan bir Neon veritabanı oluşturup DATABASE_URL'i ekleyin. Ardından panelden 'Veritabanını Kur' düğmesine basın. Tablolar oluşur ve demo veriler yüklenir.",
  },
  {
    title: "Görsel Depolama (Vercel Blob)",
    detail:
      "Logo ve ürün fotoğraflarının kalıcı olması için Vercel → Storage'dan bir Blob deposu bağlayın. BLOB_READ_WRITE_TOKEN otomatik eklenir.",
  },
  {
    title: "Admin Şifresi",
    detail:
      "Yönetim paneli girişi için ADMIN_PASSWORD ve ADMIN_SESSION_SECRET ortam değişkenlerini Vercel'de ayarlayın. (Lokal geçici şifre: noian-admin)",
  },
  {
    title: "Ödeme Altyapısı (Shopier)",
    detail:
      "Site şu an DEMO/TEST modunda; gerçek tahsilat yapmaz. Shopier API anahtarlarınızı alıp küçük bir sunucu fonksiyonu bağlamanız gerekir. Detaylı adımlar: src/lib/payment.ts",
  },
  {
    title: "Alan Adı (Domain)",
    detail:
      "noianbags.com gibi kendi alan adınızı Vercel → Settings → Domains bölümünden bağlayabilirsiniz.",
  },
  {
    title: "E-posta Gönderimi",
    detail:
      "Sipariş onayı, iletişim formu ve şifre sıfırlama e-postaları için bir e-posta servisi (Resend vb.) bağlanabilir.",
  },
];

const REPLACE = [
  { what: "Gerçek ürün fotoğrafları ve ürünler", where: "Yönetim Paneli → Ürünler" },
  { what: "Logo", where: "Yönetim Paneli → Ayarlar → Marka & Logo" },
  { what: "İletişim bilgileri (e-posta, telefon, Instagram)", where: "Yönetim Paneli → Ayarlar → İletişim" },
  { what: "Şirket/unvan/adres/vergi bilgileri", where: "Yönetim Paneli → Ayarlar → Yasal/Şirket" },
  { what: "Kargo ücreti ve süreleri", where: "Yönetim Paneli → Ayarlar → Kargo" },
  { what: "Ana sayfa başlık ve hikaye metni", where: "Yönetim Paneli → Ayarlar → Ana Sayfa Metinleri" },
  { what: "Yasal sözleşme metinleri", where: "src/pages/legal.tsx — bir uzmana onaylatın" },
];

export function OwnerGuide() {
  return (
    <div className="animate-fade-in">
      <div className="border-b border-cream-200 bg-cream-50">
        <div className="container py-12">
          <span className="badge bg-clay-50 text-clay-500">Sadece site sahibi için</span>
          <h1 className="mt-3 text-3xl sm:text-4xl">Site Sahibi Rehberi</h1>
          <p className="mt-3 max-w-2xl text-cocoa-400">
            Siteniz yayına hazır hâle gelmeden önce nelerin hazır olduğunu,
            nelerin dış kurulum gerektirdiğini ve hangi içerikleri
            değiştirmeniz gerektiğini burada bulabilirsiniz.
          </p>
        </div>
      </div>

      <div className="container grid gap-6 py-10 lg:grid-cols-3">
        {/* Hazır olanlar */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="h-5 w-5 text-sage-400" /> Hazır olanlar
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-cocoa-500">
            {READY.map((r) => (
              <li key={r} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-400" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Dış kurulum gerekenler */}
        <section className="card border-clay-200 p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-clay-400" /> Dış kurulum
            gerektirenler
          </h2>
          <ul className="mt-4 space-y-4">
            {EXTERNAL.map((e) => (
              <li key={e.title}>
                <p className="font-semibold text-cocoa-600">{e.title}</p>
                <p className="text-sm text-cocoa-400">{e.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Değiştirilecek içerikler */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <Pencil className="h-5 w-5 text-clay-400" /> Yayından önce
            değiştirin
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {REPLACE.map((r) => (
              <li key={r.what} className="rounded-xl bg-cream-200/50 p-3">
                <p className="font-semibold text-cocoa-600">{r.what}</p>
                <p className="mt-0.5 text-xs text-cocoa-400">
                  Konum: <code>{r.where}</code>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="container pb-12">
        <div className="card flex flex-col items-start gap-3 border-clay-200 bg-clay-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl">Test modu açık</h3>
            <p className="mt-1 text-sm text-cocoa-500">
              Şu an gerçek ödeme alınmıyor. Siteyi baştan sona güvenle test
              edebilir, sahte sipariş oluşturabilirsiniz.
            </p>
          </div>
          <a
            href="https://vercel.com/docs"
            target="_blank"
            rel="noreferrer"
            className="btn-outline shrink-0"
          >
            Vercel Dokümanları <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
