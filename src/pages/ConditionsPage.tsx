import React from "react";
import { ShieldCheck, MessageCircle } from "lucide-react";
import { CONDITIONS, SHOP, waLink } from "../data/catalog";
import { AdinkraOrnament } from "../components/AfricanIcons";

export const ConditionsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <AdinkraOrnament className="w-16 h-3.5 mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
          Conditions et conseils
        </h1>
        <p className="text-sm sm:text-base text-[#6E5B4E] mt-1.5">
          Des règles claires pour acheter et vendre en toute confiance sur
          African Shop.
        </p>
      </div>

      <div className="space-y-4">
        {CONDITIONS.map(([title, body], idx) => (
          <section
            key={title}
            className="rounded-3xl bg-[#FFFDF9] border border-[#1E1612]/10 p-6 shadow-craft"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#FCECE4] text-[#C84B24] font-display font-bold text-xs flex items-center justify-center">
                0{idx + 1}
              </span>
              <h2 className="font-display text-xl font-bold text-[#1E1612]">
                {title}
              </h2>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-[#4A3B32] leading-relaxed">
              {body.split("\n").map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-[#1C1410] text-[#FAF5EC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[#F2BE4B] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-lg font-bold">
              Une question ou un signalement ?
            </h3>
            <p className="text-xs sm:text-sm text-[#D6C6B6]">
              Notre équipe te répond directement sur WhatsApp.
            </p>
          </div>
        </div>
        <a
          href={waLink(
            SHOP.whatsapp,
            "Bonjour African Shop, j'ai une question concernant les conditions."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1B6B4A] text-[#FFFDF9] font-bold text-sm hover:bg-[#135238] transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Écrire sur WhatsApp
        </a>
      </div>
    </div>
  );
};
