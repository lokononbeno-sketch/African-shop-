import React, { useMemo, useState } from "react";
import { MapPin, Store } from "lucide-react";
import { CATEGORIES } from "../data/catalog";
import { AdinkraOrnament, CategoryIcon } from "../components/AfricanIcons";
import { BoutiqueCard } from "../components/Cards";
import { useStore } from "../context/StoreContext";

export const BoutiquesPage: React.FC = () => {
  const { boutiques, produits } = useStore();
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");

  const cities = useMemo(() => {
    const set = new Set(boutiques.map((b) => b.ville).filter(Boolean));
    return Array.from(set);
  }, [boutiques]);

  const filtered = useMemo(() => {
    return boutiques.filter((b) => {
      const okCity = cityFilter === "all" || b.ville === cityFilter;
      const okCat = catFilter === "all" || b.categories.includes(catFilter);
      return okCity && okCat;
    });
  }, [boutiques, cityFilter, catFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <AdinkraOrnament className="w-16 h-3.5 mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
          Boutiques près de chez toi
        </h1>
        <p className="text-sm sm:text-base text-[#6E5B4E] mt-1.5">
          {boutiques.length} boutique{boutiques.length > 1 ? "s" : ""} vérifiée
          {boutiques.length > 1 ? "s" : ""} à découvrir et contacter sur WhatsApp.
        </p>
      </div>

      {/* City & Category Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6E5B4E] mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C84B24]" />
            Ville :
          </span>
          <button
            type="button"
            onClick={() => setCityFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              cityFilter === "all"
                ? "bg-[#1C1410] text-[#FAF5EC] border-[#1C1410]"
                : "bg-[#FFFDF9] text-[#5E4D42] border-[#1E1612]/12 hover:border-[#C84B24]"
            }`}
          >
            Toutes
          </button>
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setCityFilter(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                cityFilter === city
                  ? "bg-[#C84B24] text-[#FFFDF9] border-[#C84B24]"
                  : "bg-[#FFFDF9] text-[#5E4D42] border-[#1E1612]/12 hover:border-[#C84B24]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setCatFilter("all")}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              catFilter === "all"
                ? "bg-[#F2E7D5] text-[#1E1612] border-[#C84B24]/50"
                : "bg-[#FFFDF9] text-[#5E4D42] border-[#1E1612]/10 hover:border-[#C84B24]"
            }`}
          >
            Toutes catégories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCatFilter(c.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                catFilter === c.id
                  ? "bg-[#C84B24] text-[#FFFDF9] border-[#C84B24]"
                  : "bg-[#FFFDF9] text-[#5E4D42] border-[#1E1612]/10 hover:border-[#C84B24]"
              }`}
            >
              <CategoryIcon categoryId={c.id} className="w-4 h-4" />
              {c.nom}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <BoutiqueCard
              key={b.id}
              boutique={b}
              productCount={produits.filter((p) => p.boutique === b.id).length}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-12 text-center">
          <Store className="w-10 h-10 text-[#C84B24]/60 mx-auto mb-3" />
          <p className="font-display text-lg font-bold text-[#1E1612]">
            Aucune boutique ne correspond à ces filtres
          </p>
          <button
            type="button"
            onClick={() => {
              setCityFilter("all");
              setCatFilter("all");
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#1C1410] text-[#FAF5EC] text-sm font-bold cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
