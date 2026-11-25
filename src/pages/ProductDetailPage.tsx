import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Check,
} from "lucide-react";
import {
  buildProductOrderWhatsApp,
  CATEGORIES,
  fmtFCFA,
  formatLieu,
} from "../data/catalog";
import { CategoryIcon } from "../components/AfricanIcons";
import { BoutiqueAvatar, ProductCard, ShareBox } from "../components/Cards";
import { useStore } from "../context/StoreContext";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, getBoutique, produits, addToCart, favorites, toggleFavorite } =
    useStore();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-[#1E1612]">
          Produit introuvable
        </h1>
        <p className="text-[#6E5B4E] mt-2">
          Cet article n’est plus disponible dans le catalogue.
        </p>
        <Link
          to="/produits"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-[#C84B24] text-[#FFFDF9] font-bold text-sm"
        >
          Retour aux produits
        </Link>
      </div>
    );
  }

  const boutique = getBoutique(product.boutique);
  const category = CATEGORIES.find((c) => c.id === product.categorie);
  const isFav = favorites.includes(product.id);
  const otherProducts = produits
    .filter((p) => p.boutique === product.boutique && p.id !== product.id)
    .slice(0, 4);

  const shareUrl = `${window.location.origin}${window.location.pathname}#/p/${product.id}`;

  const handleAdd = () => {
    addToCart(product.id, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to={category ? `/c/${category.id}` : "/produits"}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6E5B4E] hover:text-[#C84B24] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {category ? category.nom : "Produits"}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Product Image Showcase */}
        <div className="lg:col-span-6">
          <div className="relative rounded-t-[3.5rem] rounded-b-[2rem] overflow-hidden bg-[#FFFDF9] border-4 border-[#FFFDF9] shadow-xl aspect-square">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.nom}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F2E7D5] text-[#C84B24]/50">
                <CategoryIcon categoryId={product.categorie} className="w-24 h-24" />
              </div>
            )}

            {product.badge && product.dispo && (
              <span className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#1C1410]/85 text-[#F2BE4B] backdrop-blur-md">
                {product.badge}
              </span>
            )}

            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
              className={`absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isFav
                  ? "bg-[#C84B24] text-[#FFFDF9]"
                  : "bg-[#FFFDF9]/90 text-[#1E1612] hover:text-[#C84B24]"
              }`}
            >
              <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
            </button>

            {!product.dispo && (
              <div className="absolute inset-0 bg-[#1C1410]/55 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-5 py-2 rounded-full bg-[#FAF5EC] text-[#1E1612] text-sm font-extrabold uppercase tracking-wider">
                  Indisponible
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {category && (
                <Link
                  to={`/c/${category.id}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#F2E7D5] text-[#57453A] hover:bg-[#C84B24] hover:text-[#FFFDF9] transition-colors"
                >
                  {category.nom}
                </Link>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.dispo
                    ? "bg-[#E5F3EC] text-[#1B6B4A]"
                    : "bg-[#FCECE4] text-[#A63B1A]"
                }`}
              >
                {product.dispo ? "En stock" : "Rupture de stock"}
              </span>
              {product.origine && (
                <span className="text-xs font-medium text-[#6E5B4E]">
                  · {product.origine}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612] leading-tight">
              {product.nom}
            </h1>

            <p className="mt-3 text-3xl font-extrabold text-[#C84B24] tabular-nums">
              {fmtFCFA(product.prix)}
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#4A3B32] leading-relaxed">
            {product.description}
          </p>

          {/* Boutique Card Link */}
          {boutique && (
            <Link
              to={`/b/${boutique.id}`}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFDF9] border border-[#1E1612]/10 hover:border-[#C84B24]/50 shadow-craft transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <BoutiqueAvatar boutique={boutique} />
                <div>
                  <p className="font-display font-bold text-base text-[#1E1612] group-hover:text-[#C84B24] transition-colors">
                    {boutique.nom}
                  </p>
                  <p className="text-xs text-[#6E5B4E] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C84B24]" />
                    {formatLieu(boutique)}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6E5B4E] group-hover:text-[#C84B24] group-hover:translate-x-0.5 transition-all" />
            </Link>
          )}

          {/* Quantity + Order Actions */}
          {product.dispo ? (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFDF9] border border-[#1E1612]/10">
                <span className="text-sm font-bold text-[#1E1612]">Quantité</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Diminuer la quantité"
                    className="w-9 h-9 rounded-xl bg-[#FAF5EC] border border-[#1E1612]/12 flex items-center justify-center text-[#1E1612] hover:border-[#C84B24] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-base tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Augmenter la quantité"
                    className="w-9 h-9 rounded-xl bg-[#FAF5EC] border border-[#1E1612]/12 flex items-center justify-center text-[#1E1612] hover:border-[#C84B24] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="font-extrabold text-base text-[#C84B24] tabular-nums">
                  {fmtFCFA(product.prix * quantity)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-[#C84B24] text-[#FFFDF9] font-extrabold text-sm sm:text-base shadow-lg shadow-[#C84B24]/25 hover:bg-[#A63B1A] transition-all cursor-pointer"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      Ajouté au panier
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </button>

                <a
                  href={buildProductOrderWhatsApp(product, boutique, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-[#1B6B4A] text-[#FFFDF9] font-extrabold text-sm sm:text-base shadow-lg shadow-[#1B6B4A]/20 hover:bg-[#135238] transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Commander sur WhatsApp
                </a>
              </div>

              <p className="flex items-center gap-2 text-xs text-[#6E5B4E]">
                <ShieldCheck className="w-4 h-4 text-[#1B6B4A] shrink-0" />
                Le paiement et la livraison se décident directement avec le
                commerçant.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FCECE4] border border-[#C84B24]/25 text-sm font-semibold text-[#A63B1A]">
              Ce produit est actuellement en rupture de stock. Découvre les
              autres créations de cette boutique ci-dessous.
            </div>
          )}

          <ShareBox
            title="Partager ce produit"
            text={`Regarde « ${product.nom} » sur African Shop : ${fmtFCFA(product.prix)}.`}
            url={shareUrl}
          />
        </div>
      </div>

      {/* Other products from the same boutique */}
      {otherProducts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[#1E1612]/10">
          <h2 className="font-display text-2xl font-bold text-[#1E1612] mb-5">
            Autres créations de {boutique?.nom || "la boutique"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {otherProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
