import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Sparkles } from "lucide-react";
import { CATEGORIES, normText } from "../data/catalog";
import { AdinkraOrnament } from "../components/AfricanIcons";
import { BoutiqueCard, ProductCard } from "../components/Cards";
import { useStore } from "../context/StoreContext";

const TRENDING = [
  "Pagne wax",
  "Karité",
  "Cotonou",
  "Bissap",
  "Boubou",
  "Savon noir",
  "Cuir",
  "Raphia",
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const { boutiques, produits } = useStore();

  useEffect(() => {
    const paramQ = searchParams.get("q") || "";
    if (paramQ && paramQ !== query) {
      setQuery(paramQ);
    }
  }, [searchParams]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (val.trim()) setSearchParams({ q: val }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const results = useMemo(() => {
    const n = normText(query).trim();
    if (!n) return { boutiques: [], produits: [] };

    const matchingBoutiques = boutiques.filter((b) => {
      const catLabels = b.categories
        .map((id) => CATEGORIES.find((c) => c.id === id)?.nom || id)
        .join(" ");
      return normText(
        [b.nom, b.description, b.ville, b.quartier, catLabels].join(" ")
      ).includes(n);
    });

    const matchingProducts = produits.filter((p) => {
      const catName = CATEGORIES.find((c) => c.id === p.categorie)?.nom || "";
      const shopName = boutiques.find((b) => b.id === p.boutique)?.nom || "";
      return normText(
        [p.nom, p.description, p.origine || "", catName, shopName].join(" ")
      ).includes(n);
    });

    return { boutiques: matchingBoutiques, produits: matchingProducts };
  }, [query, boutiques, produits]);

  const hasQuery = query.trim().length > 0;
  const totalCount = results.boutiques.length + results.produits.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="max-w-2xl mb-8">
        <AdinkraOrnament className="w-16 h-3.5 mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
          Rechercher sur African Shop
        </h1>
        <p className="text-sm text-[#6E5B4E] mt-1">
          Trouve un produit, une boutique, une catégorie ou un quartier.
        </p>

        <div className="relative mt-5">
          <Search className="w-5 h-5 text-[#C84B24] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Un produit, une boutique, un quartier…"
            aria-label="Rechercher"
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#FFFDF9] border border-[#1E1612]/15 text-base text-[#1E1612] placeholder:text-[#8C786A] shadow-craft focus:outline-none focus:border-[#C84B24] focus:ring-4 focus:ring-[#C84B24]/10"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => handleChange("")}
              aria-label="Effacer la recherche"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF5EC] flex items-center justify-center text-[#6E5B4E] hover:text-[#C84B24] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Search Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6E5B4E] flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D9911A]" />
            Recherches fréquentes :
          </span>
          {TRENDING.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChange(term)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F2E7D5]/80 text-[#57453A] hover:bg-[#C84B24] hover:text-[#FFFDF9] transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {!hasQuery ? (
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-10 text-center">
          <Search className="w-10 h-10 text-[#C84B24]/45 mx-auto mb-3" />
          <p className="font-display text-lg font-bold text-[#1E1612]">
            Que recherches-tu aujourd’hui ?
          </p>
          <p className="text-sm text-[#6E5B4E] mt-1">
            Tape un mot ou clique sur une suggestion ci-dessus.
          </p>
        </div>
      ) : totalCount === 0 ? (
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-10 text-center">
          <p className="font-display text-xl font-bold text-[#1E1612]">
            Aucun résultat pour « {query} »
          </p>
          <p className="text-sm text-[#6E5B4E] mt-1">
            Essaie avec un mot plus court ou explore nos catégories.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {results.boutiques.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-[#1E1612] mb-4">
                Boutiques ({results.boutiques.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.boutiques.map((b) => (
                  <BoutiqueCard
                    key={b.id}
                    boutique={b}
                    productCount={produits.filter((p) => p.boutique === b.id).length}
                  />
                ))}
              </div>
            </section>
          )}

          {results.produits.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-[#1E1612] mb-4">
                Produits ({results.produits.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {results.produits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
