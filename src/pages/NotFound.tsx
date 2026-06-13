import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl text-clay-300">404</p>
      <h1 className="mt-4 text-3xl">Sayfa bulunamadı</h1>
      <p className="mt-2 max-w-md text-cocoa-400">
        Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Sizi güzel
        çantalarımıza geri götürelim.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          Ana Sayfa
        </Link>
        <Link to="/magaza" className="btn-outline">
          Mağaza
        </Link>
      </div>
    </div>
  );
}
