import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { AdminProvider } from "@/admin/AdminContext";
import { AdminLayout } from "@/admin/AdminLayout";
import { AdminLogin } from "@/admin/pages/AdminLogin";
import { Dashboard } from "@/admin/pages/Dashboard";
import { ProductsAdmin } from "@/admin/pages/ProductsAdmin";
import { ProductEdit } from "@/admin/pages/ProductEdit";
import { CategoriesAdmin } from "@/admin/pages/CategoriesAdmin";
import { OrdersAdmin } from "@/admin/pages/OrdersAdmin";
import { TestimonialsAdmin } from "@/admin/pages/TestimonialsAdmin";
import { SettingsAdmin } from "@/admin/pages/SettingsAdmin";

import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { OrderConfirmation } from "@/pages/OrderConfirmation";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Account } from "@/pages/Account";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Faq } from "@/pages/Faq";
import { OwnerGuide } from "@/pages/OwnerGuide";
import { NotFound } from "@/pages/NotFound";
import {
  ShippingPolicy,
  ReturnsExchange,
  PrivacyPolicy,
  DistanceSalesContract,
  PreliminaryInfo,
} from "@/pages/legal";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SettingsProvider>
          <CatalogProvider>
            <AuthProvider>
              <AdminProvider>
                <CartProvider>
                  <Routes>
                    {/* Yönetim paneli */}
                    <Route path="/admin/giris" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="urunler" element={<ProductsAdmin />} />
                      <Route path="urunler/yeni" element={<ProductEdit />} />
                      <Route path="urunler/:id" element={<ProductEdit />} />
                      <Route path="kategoriler" element={<CategoriesAdmin />} />
                      <Route path="siparisler" element={<OrdersAdmin />} />
                      <Route path="yorumlar" element={<TestimonialsAdmin />} />
                      <Route path="ayarlar" element={<SettingsAdmin />} />
                    </Route>

                    {/* Mağaza (müşteri tarafı) */}
                    <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/magaza" element={<Shop />} />
                <Route path="/urun/:slug" element={<ProductDetail />} />
                <Route path="/sepet" element={<Cart />} />
                <Route path="/odeme" element={<Checkout />} />
                <Route path="/tesekkurler" element={<OrderConfirmation />} />

                {/* Kimlik doğrulama */}
                <Route path="/giris" element={<Login />} />
                <Route path="/kayit" element={<Register />} />
                <Route path="/sifremi-unuttum" element={<ForgotPassword />} />
                <Route path="/hesabim" element={<Account />} />

                {/* Bilgi sayfaları */}
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/sss" element={<Faq />} />

                {/* Yasal & güven */}
                <Route path="/kargo-politikasi" element={<ShippingPolicy />} />
                <Route path="/iade-ve-degisim" element={<ReturnsExchange />} />
                <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
                <Route
                  path="/mesafeli-satis-sozlesmesi"
                  element={<DistanceSalesContract />}
                />
                <Route
                  path="/on-bilgilendirme-formu"
                  element={<PreliminaryInfo />}
                />

                {/* Site sahibi rehberi */}
                <Route path="/sahip-rehberi" element={<OwnerGuide />} />

                <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </CartProvider>
              </AdminProvider>
            </AuthProvider>
          </CatalogProvider>
        </SettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
