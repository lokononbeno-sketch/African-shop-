import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  MessageCircle,
  Truck,
} from "lucide-react";
import {
  CATEGORIES,
  formatLieu,
  getWhatsAppNumber,
  waLink,
} from "../data/catalog";
import { BoutiqueAvatar, ProductCard, ShareBox } from "../components/Cards";
import { useStore } from "../context/StoreContext";

export const BoutiqueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBoutique, produits } = useStore();

  const boutique = id ? getBoutique(id) : undefined;

  if (!boutique) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-[#1E1612]">
          Boutique introuvable
        </h1>
        <p className="text-[#6E5B4E] mt-2">
          Cette boutique n’existe pas ou n’est plus en ligne.
        </p>
        <Link
          to="/boutiques"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-[#C84B24] text-[#FFFDF9] font-bold text-sm"
        >
          Voir toutes les boutiques
        </Link>
      </div>
    );
  }

  const boutiqueProducts = produits.filter((p) => p.boutique === boutique.id);
  const shareUrl = `${window.location.origin}${window.location.pathname}#/b/${boutique.id}`;
  const waMsg = `Bonjour ${boutique.nom} 👋 Je vous écris depuis African Shop (${shareUrl}).`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/boutiques"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6E5B4E] hover:text-[#C84B24] mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux boutiques
      </Link>

      {/* Boutique Header Hero Card */}
      <div className="rounded-[2rem] bg-[#FFFDF9] border border-[#1E1612]/10 shadow-craft overflow-hidden mb-10">
        <div className="relative h-44 sm:h-56 bg-[#1C1410]">
          {boutique.cover ? (
            <img
              src={boutique.cover}
              alt={`Couverture de ${boutique.nom}`}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div
              className="w-full h-full bg-bogolan-dark"
              style={{ backgroundColor: boutique.couleur }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/80 via-[#1C1410]/20 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 relative z-10">
            <div className="flex items-end gap-4">
              <BoutiqueAvatar boutique={boutique} size="lg" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E1612] bg-[#FFFDF9]/90 sm:bg-transparent px-2 sm:px-0 rounded-lg">
                    {boutique.nom}
                  </h1>
                  {boutique.verifie && (
                    <BadgeCheck className="w-5 h-5 text-[#1B6B4A] shrink-0" />
                  )}
                </div>
                <p className="text-sm font-semibold text-[#6E5B4E] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#C84B24]" />
                  {formatLieu(boutique)}
                </p>
              </div>
            </div>

            <a
              href={waLink(getWhatsAppNumber(boutique), waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1B6B4A] text-[#FFFDF9] font-bold text-sm hover:bg-[#135238] shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Écrire sur WhatsApp
            </a>
          </div>

          <p className="mt-5 text-sm sm:text-base text-[#4A3B32] leading-relaxed max-w-3xl">
            {boutique.description}
          </p>

          {/* Info pills */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {boutique.horaires && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#1E1612]/8 text-sm text-[#4A3B32]">
                <Clock className="w-4 h-4 text-[#C84B24] shrink-0" />
                <span>{boutique.horaires}</span>
              </div>
            )}
            {boutique.livraison && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#1E1612]/8 text-sm text-[#4A3B32]">
                <Truck className="w-4 h-4 text-[#1B6B4A] shrink-0" />
                <span>{boutique.livraison}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {boutique.categories.map((cid) => {
              const cat = CATEGORIES.find((c) => c.id === cid);
              return (
                <Link
                  key={cid}
                  to={`/c/${cid}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#F2E7D5] text-[#57453A] hover:bg-[#C84B24] hover:text-[#FFFDF9] transition-colors"
                >
                  {cat?.nom || cid}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Boutique Products */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-[#1E1612] mb-5">
          Produits de la boutique{" "}
          <span className="text-base font-sans font-semibold text-[#6E5B4E]">
            ({boutiqueProducts.length})
          </span>
        </h2>

        {boutiqueProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {boutiqueProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-10 text-center text-[#6E5B4E]">
            Cette boutique n’a pas encore publié d’article.
          </div>
        )}
      </div>

      <ShareBox
        title="Partager cette boutique"
        text={`Découvre « ${boutique.nom} » sur African Shop.`}
        url={shareUrl}
      />
    </div>
  );
};
