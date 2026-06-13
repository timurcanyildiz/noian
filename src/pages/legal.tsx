/**
 * ============================================================================
 *  YASAL & GÜVEN SAYFALARI
 * ============================================================================
 *  ⚠️ ÖNEMLİ — SAHİBİNE NOT:
 *  Aşağıdaki metinler ÖRNEK / YER TUTUCUDUR. Şirket/iletişim/kargo bilgileri
 *  artık Yönetim Paneli → Ayarlar bölümünden düzenlenebilir. Sözleşme metinleri
 *  ise yasal zorunluluktur; bir mali müşavir/avukattan destek almanız önerilir.
 * ============================================================================
 */
import { StaticPage, H2, P, UL } from "@/components/StaticPage";
import { OwnerNote } from "@/components/common";
import { useSettings } from "@/context/SettingsContext";

export function ShippingPolicy() {
  const { settings } = useSettings();
  const s = settings.shipping;
  return (
    <StaticPage
      title="Kargo Politikası"
      intro="Siparişlerinizi sevgiyle paketliyor, özenle yola çıkarıyoruz."
    >
      <OwnerNote>
        Kargo süresi ve ücretlerini <strong>Yönetim Paneli → Ayarlar</strong>
        bölümünden güncelleyebilirsiniz.
      </OwnerNote>
      <H2>Kargo Süresi</H2>
      <P>
        Ürünlerimiz el yapımı olduğu için siparişiniz hazırlandıktan sonra
        kargoya verilir. Tahmini teslimat süresi{" "}
        <strong>{s.estimatedDays}</strong>'dür. Stokta olan ürünler genellikle 1
        iş günü içinde gönderilir.
      </P>
      <H2>Kargo Ücreti</H2>
      <UL>
        <li>
          <strong>{s.freeShippingThreshold} TL</strong> ve üzeri alışverişlerde
          kargo <strong>ücretsizdir</strong>.
        </li>
        <li>
          Bu tutarın altındaki siparişlerde kargo ücreti{" "}
          <strong>{s.standardCost} TL</strong>'dir.
        </li>
      </UL>
      <H2>Kargo Takibi</H2>
      <P>{s.carrierNote} Gönderim sonrası takip numaranız e-posta ile paylaşılır.</P>
    </StaticPage>
  );
}

export function ReturnsExchange() {
  const { settings } = useSettings();
  return (
    <StaticPage
      title="İade ve Değişim"
      intro="Memnuniyetiniz bizim için değerli. Koşulsuz, güvenli iade."
    >
      <OwnerNote>
        İade koşullarını kendi politikanıza göre düzenleyin. Tüketici mevzuatı
        gereği bazı haklar zorunludur.
      </OwnerNote>
      <H2>Cayma Hakkı</H2>
      <P>
        Ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde
        hiçbir gerekçe göstermeden iade hakkınız vardır.
      </P>
      <H2>İade Koşulları</H2>
      <UL>
        <li>Ürün kullanılmamış ve yeniden satılabilir durumda olmalıdır.</li>
        <li>Varsa orijinal ambalajı ve etiketleri korunmalıdır.</li>
        <li>Kişiye özel üretilen siparişler iade kapsamı dışında olabilir.</li>
      </UL>
      <H2>Değişim</H2>
      <P>
        Renk veya model değişikliği talepleriniz için bizimle{" "}
        <a
          href={`mailto:${settings.contact.email}`}
          className="text-clay-400 underline"
        >
          {settings.contact.email}
        </a>{" "}
        üzerinden iletişime geçebilirsiniz.
      </P>
    </StaticPage>
  );
}

export function PrivacyPolicy() {
  const { settings } = useSettings();
  return (
    <StaticPage
      title="Gizlilik Politikası"
      intro="Kişisel verilerinizin güvenliği bizim için önemlidir."
    >
      <OwnerNote>
        Bu metin örnektir. KVKK uyumlu nihai metni bir uzmana hazırlatmanız
        önerilir.
      </OwnerNote>
      <H2>Hangi Verileri Topluyoruz?</H2>
      <UL>
        <li>Ad, soyad, e-posta, telefon ve teslimat adresi bilgileri.</li>
        <li>Sipariş geçmişi ve iletişim tercihleri.</li>
      </UL>
      <H2>Verileri Nasıl Kullanıyoruz?</H2>
      <P>
        Verileriniz yalnızca siparişinizi işleme almak, teslim etmek ve sizinle
        iletişim kurmak için kullanılır. Üçüncü taraflarla pazarlama amacıyla
        paylaşılmaz.
      </P>
      <H2>İletişim</H2>
      <P>
        Veri talepleriniz için:{" "}
        <a
          href={`mailto:${settings.contact.email}`}
          className="text-clay-400 underline"
        >
          {settings.contact.email}
        </a>
      </P>
    </StaticPage>
  );
}

export function DistanceSalesContract() {
  const { settings } = useSettings();
  const l = settings.legal;
  return (
    <StaticPage
      title="Mesafeli Satış Sözleşmesi"
      intro="Bu sayfa, siparişlerde geçerli olacak mesafeli satış sözleşmesi taslağıdır."
    >
      <OwnerNote>
        Bu bir <strong>yer tutucu taslaktır</strong> ve yasal olarak geçerli
        değildir. Şirket bilgilerini <strong>Yönetim Paneli → Ayarlar</strong>
        bölümünden doldurun ve bir hukuk/mali müşavir onayından geçirin.
      </OwnerNote>
      <H2>1. Taraflar — SATICI Bilgileri</H2>
      <UL>
        <li>Unvan: {l.companyTitle}</li>
        <li>Adres: {l.address}</li>
        <li>
          Vergi Dairesi / No: {l.taxOffice} — {l.taxNumber}
        </li>
        <li>E-posta: {settings.contact.email}</li>
        <li>Telefon: {settings.contact.phone}</li>
      </UL>
      <H2>2. Konu</H2>
      <P>
        İşbu sözleşme, ALICI'nın SATICI'ya ait internet sitesinden sipariş
        ettiği ürünün satışı ve teslimi ile ilgili tarafların hak ve
        yükümlülüklerini düzenler.
      </P>
      <H2>3. Cayma Hakkı</H2>
      <P>
        ALICI, malı teslim aldığı tarihten itibaren 14 gün içinde cayma hakkına
        sahiptir. [Detayları İade ve Değişim politikanıza göre düzenleyin.]
      </P>
      <H2>4. Teslimat ve Ödeme</H2>
      <P>
        Ödeme [ödeme sağlayıcısı] aracılığıyla alınır. Teslimat{" "}
        {settings.shipping.carrierNote.toLowerCase()}
      </P>
    </StaticPage>
  );
}

export function PreliminaryInfo() {
  const { settings } = useSettings();
  const l = settings.legal;
  return (
    <StaticPage
      title="Ön Bilgilendirme Formu"
      intro="Sipariş öncesi bilmeniz gereken temel bilgiler."
    >
      <OwnerNote>
        <strong>Yer tutucu form.</strong> Mesafeli sözleşmeler yönetmeliği
        gereği bu form sipariş onayından önce sunulmalıdır. Bilgileri Ayarlar'dan
        tamamlayın.
      </OwnerNote>
      <H2>Satıcı Bilgileri</H2>
      <UL>
        <li>Unvan: {l.companyTitle}</li>
        <li>Adres: {l.address}</li>
        <li>
          İletişim: {settings.contact.email} / {settings.contact.phone}
        </li>
      </UL>
      <H2>Ürün ve Fiyat Bilgisi</H2>
      <P>
        Satışa konu ürünün tüm vergiler dahil satış fiyatı, sipariş özetinde ve
        ürün sayfasında belirtilir.
      </P>
      <H2>Teslimat ve Cayma Hakkı</H2>
      <P>
        Teslimat süresi {settings.shipping.estimatedDays}'dür. Cayma hakkı ve
        iade koşulları için İade ve Değişim sayfasını inceleyin.
      </P>
    </StaticPage>
  );
}
