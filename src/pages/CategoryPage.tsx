import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "../data/catalog";
import { CategoryIcon } from "../components/AfricanIcons";
import { BoutiqueCard, ProductCard } from "../components/Cards";
import { useStore } from "../context/StoreContext";

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { boutiques, produits } = useStore();

  const cat = CATEGORIES.find((c) => c.id === id) || {
    id: id || "categorie",
    nom: id || "Catégorie",
    sousTitre: "Sélection artisanale",
    accent: "#C84B24",
    bgTint: "#FCECE4",
  };

  const matchingProducts = produits.filter((p) => p.categorie === cat.id);
  const matchingBoutiques = boutiques.filter((b) =>
    b.categories.includes(cat.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/produits"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6E5B4E] hover:text-[#C84B24] mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Toutes les catégories
      </Link>

      {/* Category Header Banner */}
      <div
        className="rounded-[2rem] p-6 sm:p-8 mb-8 border border-[#1E1612]/10 bg-bogolan-light flex flex-col sm:flex-row sm:items-center gap-5"
        style={{ backgroundColor: cat.bgTint }}
      >
        <div
          className="w-16 h-16 rounded-t-full rounded-b-2xl bg-[#FFFDF9] flex items-center justify-center shadow-md shrink-0"
          style={{ color: cat.accent }}
        >
          <CategoryIcon categoryId={cat.id} className="w-9 h-9" />
        </div>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
            {cat.nom}
          </h1>
          <p className="text-sm sm:text-base text-[#5E4D42] mt-1">
            {cat.sousTitre} · {matchingProducts.length} article
            {matchingProducts.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Quick switch chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        {CATEGORIES.map((item) => (
          <Link
            key={item.id}
            to={`/c/${item.id}`}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
              item.id === cat.id
                ? "bg-[#1C1410] text-[#FAF5EC] border-[#1C1410]"
                : "bg-[#FFFDF9] text-[#5E4D42] border-[#1E1612]/12 hover:border-[#C84B24]"
            }`}
          >
            <CategoryIcon categoryId={item.id} className="w-4 h-4" />
            {item.nom}
          </Link>
        ))}
      </div>

      {matchingBoutiques.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-[#1E1612] mb-4">
            Boutiques spécialisées
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchingBoutiques.map((b) => (
              <BoutiqueCard
                key={b.id}
                boutique={b}
                productCount={produits.filter((p) => p.boutique === b.id).length}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl font-bold text-[#1E1612] mb-4">
          Produits
        </h2>
        {matchingProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {matchingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-10 text-center text-[#6E5B4E]">
            Aucun produit dans cette catégorie pour le moment.
          </div>
        )}
      </section>
    </div>
  );
};
