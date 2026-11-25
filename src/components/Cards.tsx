import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Plus,
  ChevronRight,
  BadgeCheck,
  Share2,
  Copy,
  MessageCircle,
} from "lucide-react";
import {
  Boutique,
  Category,
  CATEGORIES,
  fmtFCFA,
  formatLieu,
  getInitials,
  Product,
} from "../data/catalog";
import { CategoryIcon } from "./AfricanIcons";
import { useStore } from "../context/StoreContext";

export const CategoryCard: React.FC<{
  category: Category;
  count?: number;
}> = ({ category, count }) => (
  <Link
    to={`/c/${category.id}`}
    className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-t-[2rem] rounded-b-2xl bg-[#FFFDF9] border border-[#1E1612]/10 shadow-craft hover:shadow-craft-hover hover:-translate-y-1 hover:border-[#C84B24]/45 transition-all duration-300 overflow-hidden"
  >
    {/* Subtle geometric top accent arc */}
    <div
      className="w-14 h-14 sm:w-16 sm:h-16 rounded-t-full rounded-b-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 border"
      style={{
        backgroundColor: category.bgTint,
        color: category.accent,
        borderColor: `${category.accent}28`,
      }}
    >
      <CategoryIcon categoryId={category.id} className="w-8 h-8" />
    </div>
    <h3 className="font-display text-base font-bold text-[#1E1612] group-hover:text-[#C84B24] transition-colors">
      {category.nom}
    </h3>
    <p className="text-xs text-[#6E5B4E] mt-0.5 line-clamp-1">
      {category.sousTitre}
    </p>
    {typeof count === "number" && (
      <span className="mt-2.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5EC] text-[#6E5B4E] border border-[#1E1612]/8 tabular-nums">
        {count} article{count > 1 ? "s" : ""}
      </span>
    )}
  </Link>
);

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { getBoutique, addToCart, favorites, toggleFavorite } = useStore();
  const boutique = getBoutique(product.boutique);
  const isFav = favorites.includes(product.id);

  return (
    <div className="group relative flex flex-col bg-[#FFFDF9] rounded-[1.5rem] border border-[#1E1612]/10 shadow-craft hover:shadow-craft-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image area with subtle African arch framing inside */}
      <Link
        to={`/p/${product.id}`}
        className="relative block p-2.5 pb-0 focus-visible:outline-none"
      >
        <div className="relative aspect-square overflow-hidden rounded-t-[1.75rem] rounded-b-xl bg-[#F2E7D5]">
          {product.photo ? (
            <img
              src={product.photo}
              alt={product.nom}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C84B24]/50">
              <CategoryIcon categoryId={product.categorie} className="w-12 h-12" />
            </div>
          )}

          {/* Badge */}
          {product.badge && product.dispo && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1C1410]/85 text-[#F2BE4B] backdrop-blur-md">
              {product.badge}
            </span>
          )}

          {/* Out of stock overlay */}
          {!product.dispo && (
            <div className="absolute inset-0 bg-[#1C1410]/55 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-3.5 py-1.5 rounded-full bg-[#FAF5EC] text-[#1E1612] text-xs font-extrabold uppercase tracking-wider shadow">
                Indisponible
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Favorite button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        aria-label={isFav ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"}
        className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
          isFav
            ? "bg-[#C84B24] text-[#FFFDF9] shadow-md scale-105"
            : "bg-[#FFFDF9]/85 text-[#1E1612]/70 hover:text-[#C84B24] border border-[#1E1612]/10"
        }`}
      >
        <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
      </button>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {boutique && (
            <Link
              to={`/b/${boutique.id}`}
              className="text-[11px] font-bold uppercase tracking-wider text-[#6E5B4E] hover:text-[#C84B24] transition-colors line-clamp-1"
            >
              {boutique.nom}
            </Link>
          )}
          <Link to={`/p/${product.id}`}>
            <h3 className="font-display text-[15px] sm:text-base font-bold text-[#1E1612] group-hover:text-[#C84B24] transition-colors line-clamp-2 mt-0.5 leading-snug">
              {product.nom}
            </h3>
          </Link>
          {product.origine && (
            <p className="text-xs text-[#6E5B4E] mt-1 line-clamp-1">
              {product.origine}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1E1612]/8">
          <p className="text-[15px] sm:text-base font-extrabold text-[#C84B24] tabular-nums">
            {fmtFCFA(product.prix)}
          </p>
          <button
            type="button"
            disabled={!product.dispo}
            onClick={() => addToCart(product.id, 1)}
            aria-label={`Ajouter ${product.nom} au panier`}
            className="w-9 h-9 rounded-full bg-[#1C1410] text-[#FAF5EC] flex items-center justify-center hover:bg-[#C84B24] disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const BoutiqueAvatar: React.FC<{
  boutique: Boutique;
  size?: "sm" | "lg";
}> = ({ boutique, size = "sm" }) => {
  const dims = size === "lg" ? "w-20 h-20 text-2xl rounded-[1.5rem]" : "w-14 h-14 text-base rounded-2xl";
  return (
    <div
      className={`${dims} relative overflow-hidden shrink-0 flex items-center justify-center font-display font-bold text-[#FAF5EC] shadow-md border-2 border-[#FFFDF9]`}
      style={{ backgroundColor: boutique.couleur || "#C84B24" }}
    >
      {boutique.logo ? (
        <img
          src={boutique.logo}
          alt={boutique.nom}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(boutique.nom)}</span>
      )}
    </div>
  );
};

export const BoutiqueCard: React.FC<{
  boutique: Boutique;
  productCount?: number;
}> = ({ boutique, productCount }) => {
  const catNames = boutique.categories
    .map((cid) => CATEGORIES.find((c) => c.id === cid)?.nom || cid)
    .slice(0, 3);

  return (
    <Link
      to={`/b/${boutique.id}`}
      className="group flex flex-col bg-[#FFFDF9] rounded-[1.5rem] border border-[#1E1612]/10 shadow-craft hover:shadow-craft-hover hover:-translate-y-1 hover:border-[#C84B24]/40 transition-all duration-300 overflow-hidden"
    >
      {/* Top mini editorial banner */}
      <div className="relative h-24 w-full overflow-hidden bg-[#221712]">
        {boutique.cover ? (
          <img
            src={boutique.cover}
            alt=""
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full bg-bogolan-dark"
            style={{ backgroundColor: boutique.couleur }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/70 via-transparent to-transparent" />
        {typeof productCount === "number" && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF5EC]/92 text-[#1E1612] shadow-sm tabular-nums">
            {productCount} produit{productCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="p-4 pt-0 flex-1 flex flex-col justify-between">
        <div>
          <div className="-mt-7 mb-3 flex items-end justify-between">
            <BoutiqueAvatar boutique={boutique} />
            <span className="w-8 h-8 rounded-full bg-[#FAF5EC] border border-[#1E1612]/10 flex items-center justify-center text-[#6E5B4E] group-hover:bg-[#C84B24] group-hover:text-[#FFFDF9] group-hover:border-[#C84B24] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-lg font-bold text-[#1E1612] group-hover:text-[#C84B24] transition-colors line-clamp-1">
              {boutique.nom}
            </h3>
            {boutique.verifie && (
              <BadgeCheck className="w-4 h-4 text-[#1B6B4A] shrink-0" />
            )}
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#6E5B4E]">
            <MapPin className="w-3.5 h-3.5 text-[#C84B24] shrink-0" />
            <span className="line-clamp-1">{formatLieu(boutique)}</span>
          </p>

          <p className="mt-2 text-xs text-[#5E4D42] line-clamp-2 leading-relaxed">
            {boutique.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1E1612]/8 flex flex-wrap gap-1.5">
          {catNames.map((name) => (
            <span
              key={name}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2E7D5] text-[#57453A]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export const ShareBox: React.FC<{
  title: string;
  text: string;
  url: string;
}> = ({ title, text, url }) => {
  const { showToast } = useStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Lien copié dans le presse-papiers !");
    } catch {
      window.prompt("Copie ce lien :", url);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: "African Shop", text, url }).catch(() => {});
    }
  };

  return (
    <div className="rounded-2xl bg-[#F2E7D5]/65 border border-[#1E1612]/10 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-1">
        <Share2 className="w-4 h-4 text-[#C84B24]" />
        <h3 className="font-display text-base font-bold text-[#1E1612]">
          {title}
        </h3>
      </div>
      <p className="text-xs text-[#6E5B4E] mb-3.5">
        Envoie cette découverte à tes proches en un clic.
      </p>
      <div className="flex flex-wrap gap-2">
        {"share" in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#1E1612]/12 text-xs font-bold text-[#1E1612] hover:border-[#C84B24] hover:text-[#C84B24] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Partager…
          </button>
        )}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B6B4A] text-[#FFFDF9] text-xs font-bold hover:bg-[#135238] transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#1E1612]/12 text-xs font-bold text-[#1E1612] hover:border-[#1A2744] hover:text-[#1A2744] transition-colors"
        >
          Facebook
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#1E1612]/12 text-xs font-bold text-[#1E1612] hover:border-[#C84B24] hover:text-[#C84B24] transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          Copier le lien
        </button>
      </div>
    </div>
  );
};
