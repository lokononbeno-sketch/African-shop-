import React from "react";
import { Link } from "react-router-dom";
import { Check, MessageCircle, Store } from "lucide-react";
import { SHOP, waLink } from "../data/catalog";
import { AdinkraOrnament } from "../components/AfricanIcons";

export const OuvrirPage: React.FC = () => {
  const waMsg =
    "Bonjour African Shop, je voudrais ouvrir ma boutique.\nNom de la boutique :\nVille / quartier :\nCe que je vends :";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <AdinkraOrnament className="w-16 h-3.5 mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
          Ouvre ta boutique sur African Shop
        </h1>
        <p className="text-base text-[#5E4D42] mt-2 max-w-2xl">
          Présente tes produits à des clients près de chez toi, et reçois leurs
          commandes directement sur ton WhatsApp.
        </p>
      </div>

      {/* 3 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          {
            num: "01",
            title: "Écris-nous sur WhatsApp",
            desc: "Dis-nous qui tu es, où se situe ta boutique et ce que tu vends.",
            color: "#C84B24",
          },
          {
            num: "02",
            title: "Envoie tes produits",
            desc: "Pour chaque article : une belle photo, le nom, le prix en FCFA et une courte description.",
            color: "#D9911A",
          },
          {
            num: "03",
            title: "Ta boutique est publiée",
            desc: "Une fois vérifiée, elle apparaît sur African Shop avec ton bouton de commande direct.",
            color: "#1B6B4A",
          },
        ].map((step) => (
          <div
            key={step.num}
            className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-6 shadow-craft"
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl font-display font-bold text-[#FAF5EC] mb-4"
              style={{ backgroundColor: step.color }}
            >
              {step.num}
            </span>
            <h2 className="font-display text-lg font-bold text-[#1E1612]">
              {step.title}
            </h2>
            <p className="text-sm text-[#5E4D42] mt-1.5 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Checklist Card */}
      <div className="rounded-[2rem] bg-[#FFFDF9] border border-[#1E1612]/10 p-6 sm:p-8 shadow-craft space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#1E1612]">
          Ce qu’il nous faut pour démarrer
        </h2>
        <ul className="space-y-3">
          {[
            "Le nom de ta boutique, ton quartier et ta ville",
            "Ton numéro WhatsApp professionnel pour recevoir les commandes",
            "Tes horaires d'ouverture et ton mode de livraison (ou retrait sur place)",
            "Les photos et les prix en FCFA de tes produits",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm sm:text-base text-[#4A3B32]"
            >
              <span className="w-6 h-6 rounded-full bg-[#E5F3EC] text-[#1B6B4A] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="p-4 rounded-2xl bg-[#FBF1DC] border border-[#D9911A]/30 text-sm text-[#6B4A10] font-medium">
          {SHOP.offre}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={waLink(SHOP.whatsapp, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#1B6B4A] text-[#FFFDF9] font-extrabold text-sm sm:text-base hover:bg-[#135238] transition-colors shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Ouvrir ma boutique sur WhatsApp
          </a>
          <Link
            to="/vendeur"
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#1C1410] text-[#FAF5EC] font-bold text-sm sm:text-base hover:bg-[#C84B24] transition-colors"
          >
            <Store className="w-5 h-5" />
            Créer en ligne (Espace vendeur)
          </Link>
        </div>
      </div>
    </div>
  );
};
