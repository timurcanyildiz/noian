import type { Testimonial } from "./types";

/**
 * DEMO MÜŞTERİ YORUMLARI (opsiyonel)
 * OWNER: Gerçek müşteri yorumlarınızı buraya ekleyebilir veya bu bölümü
 * tamamen kaldırabilirsiniz.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    authorName: "Elif K.",
    location: "İzmir",
    rating: 5,
    text: "Çantamın işçiliği harika. Her dikişte emeği hissediyorsunuz. Annenizin ellerine sağlık!",
  },
  {
    id: "t-2",
    authorName: "Merve T.",
    location: "İstanbul",
    rating: 5,
    text: "Hediye için aldım, kutusundan çıktığı an çok beğenildi. Kargosu da özenliydi.",
  },
  {
    id: "t-3",
    authorName: "Selin A.",
    location: "Ankara",
    rating: 5,
    text: "Hem hafif hem dayanıklı. Günlük kullanımda çok rahat, rengine bayıldım.",
  },
];
