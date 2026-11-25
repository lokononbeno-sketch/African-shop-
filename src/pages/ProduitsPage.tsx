import React, { useMemo, useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import { CATEGORIES } from "../data/catalog";
import { AdinkraOrnament } from "../components/AfricanIcons";
import { CategoryCard, ProductCard } from "../components/Cards";
import { useStore } from "../context/StoreContext";

export const ProduitsPage: React.FC = () => {
  const { produits } = useStore();
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const displayed = useMemo(() => {
    const base = onlyAvailable ? produits.filter((p) => p.dispo) : [...produits];
    if (sortBy === "price-asc") base.sort((a, b) => a.prix - b.prix);
    if (sortBy === "price-desc") base.sort((a, b) => b.prix - a.prix);
    return base;
  }, [produits, sortBy, onlyAvailable]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <AdinkraOrnament className="w-16 h-3.5 mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
          Catalogue & Catégories
        </h1>
        <p className="text-sm sm:text-base text-[#6E5B4E] mt-1.5">
          Explore les 6 univers ou parcours l’ensemble des créations locales.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-12">
        {CATEGORIES.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            count={produits.filter((p) => p.categorie === c.id).length}
          />
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#1E1612]/10">
        <h2 className="font-display text-2xl font-bold text-[#1E1612]">
          Tous les produits{" "}
          <span className="font-sans text-sm font-semibold text-[#6E5B4E]">
            ({displayed.length})
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOnlyAvailable((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              onlyAvailable
                ? "bg-[#1B6B4A] text-[#FFFDF9] border-[#1B6B4A]"
                : "bg-[#FFFDF9] text-[#5E4D42] border-[#1E1612]/12 hover:border-[#1B6B4A]"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            En stock uniquement
          </button>

          <div className="inline-flex items-center gap-1.5 bg-[#FFFDF9] border border-[#1E1612]/12 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C84B24]" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
              }
              aria-label="Trier les produits"
              className="bg-transparent text-xs font-bold text-[#1E1612] focus:outline-none cursor-pointer"
            >
              <option value="featured">Recommandés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {displayed.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
