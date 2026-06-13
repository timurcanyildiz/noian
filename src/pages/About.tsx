import { Link } from "react-router-dom";
import { Heart, Scissors, Leaf } from "lucide-react";
import { OwnerNote } from "@/components/common";

export function About() {
  return (
    <div className="animate-fade-in">
      <section className="container grid items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay-400">
            Hikayemiz
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">
            Bir annenin ellerinde başlayan yolculuk
          </h1>
          <p className="mt-5 text-lg text-cocoa-400">
            Noian Bags, annemin yıllar içinde biriken kumaş sevgisinden doğdu.
            Her şey, evimizin bir köşesindeki dikiş makinesi ve sabırla seçilmiş
            kumaşlarla başladı.
          </p>
          <p className="mt-4 text-cocoa-500">
            Biz büyük bir marka değiliz. Küçük, samimi ve gerçeğiz. Sattığımız
            her çanta, annemin elleriyle tek tek dikiliyor; bu yüzden her parça
            biricik. Aynı kumaştan iki çanta bile birbirinin tıpatıp aynısı
            değildir — işte el emeğinin güzelliği burada.
          </p>
        </div>
        <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
          {/* OWNER: Annenizin gerçek fotoğrafı buraya çok yakışır. */}
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
            alt="El işi dikiş"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-cream-200/50 py-14">
        <div className="container grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Scissors,
              title: "El emeği",
              text: "Her dikiş elle, sabırla atılır. Seri üretim yoktur.",
            },
            {
              icon: Leaf,
              title: "Özenli kumaşlar",
              text: "Dayanıklı, doğa dostu ve güzel kumaşlar seçiyoruz.",
            },
            {
              icon: Heart,
              title: "Sevgiyle",
              text: "Her çanta, bir aile emeğinin ürünü olarak yola çıkar.",
            },
          ].map((v) => (
            <div key={v.title} className="card p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-clay-50 text-clay-400">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl text-cocoa-600">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-cocoa-400">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <OwnerNote>
          Bu hikâye metni örnektir. Annenizin gerçek hikâyesini, üretim
          sürecinizi ve markanızın doğuşunu buraya yazarak müşterilerle samimi
          bir bağ kurabilirsiniz.
        </OwnerNote>
        <div className="mt-8 text-center">
          <Link to="/magaza" className="btn-primary">
            Çantaları keşfet
          </Link>
        </div>
      </section>
    </div>
  );
}
