import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BoutiquesPage } from "./pages/BoutiquesPage";
import { BoutiqueDetailPage } from "./pages/BoutiqueDetailPage";
import { ProduitsPage } from "./pages/ProduitsPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SearchPage } from "./pages/SearchPage";
import { CartPage } from "./pages/CartPage";
import { AccountPage } from "./pages/AccountPage";
import { VendorPage } from "./pages/VendorPage";
import { OuvrirPage } from "./pages/OuvrirPage";
import { ConditionsPage } from "./pages/ConditionsPage";

const NotFoundPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
    <h1 className="font-display text-4xl font-bold text-[#1E1612]">
      Page introuvable
    </h1>
    <p className="text-[#6E5B4E] mt-2">
      Cette page n’existe pas ou a été déplacée.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 rounded-2xl bg-[#C84B24] text-[#FFFDF9] font-bold text-sm hover:bg-[#A63B1A] transition-colors"
    >
      Retour à l’accueil
    </Link>
  </div>
);

export function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/boutiques" element={<BoutiquesPage />} />
            <Route path="/b/:id" element={<BoutiqueDetailPage />} />
            <Route path="/produits" element={<ProduitsPage />} />
            <Route path="/c/:id" element={<CategoryPage />} />
            <Route path="/p/:id" element={<ProductDetailPage />} />
            <Route path="/chercher" element={<SearchPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/compte" element={<AccountPage />} />
            <Route path="/vendeur" element={<VendorPage />} />
            <Route path="/ouvrir" element={<OuvrirPage />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </HashRouter>
  );
}

export default App;
