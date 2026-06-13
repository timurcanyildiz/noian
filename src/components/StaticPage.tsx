/** Bilgi / yasal sayfalar için ortak, okunur tipografili kabuk. */
export function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <div className="border-b border-cream-200 bg-cream-50">
        <div className="container py-12">
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          {intro && <p className="mt-3 max-w-2xl text-cocoa-400">{intro}</p>}
        </div>
      </div>
      <div className="container py-10">
        <div className="prose-noian max-w-3xl">{children}</div>
      </div>
    </div>
  );
}

/** Basit içerik blokları (Tailwind prose yerine sade stiller) */
export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-2xl first:mt-0">{children}</h2>;
}
export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-cocoa-500">{children}</p>;
}
export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-cocoa-500">{children}</ul>
  );
}
