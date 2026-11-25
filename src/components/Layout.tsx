import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Store,
  Search,
  ShoppingBag,
  User,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AfricaEmblem } from "./AfricanIcons";
import { SHOP, waLink } from "../data/catalog";
import { useStore } from "../context/StoreContext";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { cartCount, toast, user } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  const isActive = (target: string) => {
    if (target === "/") return pathname === "/";
    if (target === "/produits") {
      return (
        pathname.startsWith("/produits") ||
        pathname.startsWith("/c/") ||
        pathname.startsWith("/p/")
      );
    }
    if (target === "/boutiques") {
      return pathname.startsWith("/boutiques") || pathname.startsWith("/b/");
    }
    if (target === "/vendeur") {
      return pathname.startsWith("/vendeur") || pathname.startsWith("/ouvrir");
    }
    return pathname.startsWith(target);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EC] text-[#1E1612] pb-[82px] md:pb-0">
      {/* Fine Kente woven ribbon along the top edge */}
      <div className="kente-strip w-full sticky top-0 z-50" aria-hidden="true" />

      {/* Sticky Header */}
      <header className="sticky top-[6px] z-40 bg-[#FAF5EC]/90 backdrop-blur-xl border-b border-[#1E1612]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none"
            aria-label="African Shop, accueil"
          >
            <AfricaEmblem
              size={40}
              className="shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 rounded-[11px]"
            />
            <div className="leading-none">
              <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1E1612]">
                African <span className="text-[#C84B24]">Shop</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E5B4E] mt-0.5 hidden sm:block">
                Marché & Artisanat
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigation principale"
            className="hidden md:flex items-center gap-1 bg-[#F2E7D5]/70 p-1 rounded-full border border-[#1E1612]/8"
          >
            {[
              { to: "/", label: "Accueil" },
              { to: "/boutiques", label: "Boutiques" },
              { to: "/produits", label: "Produits" },
              { to: "/vendeur", label: "Espace vendeur" },
            ].map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#1C1410] text-[#FAF5EC] shadow-sm"
                      : "text-[#57453A] hover:text-[#1E1612] hover:bg-[#FFFDF9]/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/chercher"
              aria-label="Rechercher"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                isActive("/chercher")
                  ? "bg-[#1C1410] text-[#FAF5EC] border-[#1C1410]"
                  : "bg-[#FFFDF9] text-[#1E1612] border-[#1E1612]/12 hover:border-[#C84B24] hover:text-[#C84B24]"
              }`}
            >
              <Search className="w-[18px] h-[18px]" />
            </Link>

            <Link
              to="/panier"
              aria-label="Mon panier"
              className="relative h-10 px-3.5 rounded-full flex items-center gap-2 bg-[#C84B24] text-[#FFFDF9] font-semibold text-sm shadow-sm hover:bg-[#A63B1A] transition-all"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">Panier</span>
              {cartCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#F2BE4B] text-[#1C1410] text-xs font-extrabold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/vendeur" : "/compte"}
              aria-label={user ? "Mon espace vendeur" : "Mon compte"}
              className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-full bg-[#FFFDF9] border border-[#1E1612]/12 text-[#1E1612] text-sm font-semibold hover:border-[#D9911A] transition-all"
            >
              <User className="w-[17px] h-[17px] text-[#C84B24]" />
              <span>{user ? user.name.split(" ")[0] : "Compte"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Rich Deep Cocoa & Bogolan Footer */}
      <footer className="mt-16 bg-[#1C1410] text-[#F5ECDF] bg-bogolan-dark relative overflow-hidden">
        <div className="kente-strip w-full" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#FAF5EC]/12">
            <div className="md:col-span-5 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <AfricaEmblem size={44} className="rounded-xl shadow-lg" />
                <div>
                  <div className="font-display text-2xl font-bold text-[#FAF5EC]">
                    African <span className="text-[#F2BE4B]">Shop</span>
                  </div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#D9B89C]">
                    Savoir-faire & Commerce Local
                  </div>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-[#D6C6B6] max-w-sm">
                {SHOP.slogan} Une vitrine chaleureuse qui relie les artisans,
                créateurs et commerçants d’Afrique directement à leurs clients
                via WhatsApp.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F2BE4B] bg-[#FAF5EC]/8 px-3 py-1.5 rounded-full border border-[#F2BE4B]/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cotonou · Porto-Novo · Abomey-Calavi</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h3 className="font-display text-base font-semibold text-[#F2BE4B]">
                Explorer
              </h3>
              <ul className="space-y-2.5 text-sm text-[#D6C6B6]">
                <li>
                  <Link to="/boutiques" className="hover:text-[#FAF5EC] transition-colors">
                    Toutes les boutiques
                  </Link>
                </li>
                <li>
                  <Link to="/produits" className="hover:text-[#FAF5EC] transition-colors">
                    Catalogue & catégories
                  </Link>
                </li>
                <li>
                  <Link to="/chercher" className="hover:text-[#FAF5EC] transition-colors">
                    Rechercher un article
                  </Link>
                </li>
                <li>
                  <Link to="/panier" className="hover:text-[#FAF5EC] transition-colors">
                    Mon panier
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <h3 className="font-display text-base font-semibold text-[#F2BE4B]">
                Commerçants & Confiance
              </h3>
              <ul className="space-y-2.5 text-sm text-[#D6C6B6]">
                <li>
                  <Link to="/ouvrir" className="hover:text-[#FAF5EC] transition-colors">
                    Ouvrir ma boutique
                  </Link>
                </li>
                <li>
                  <Link to="/vendeur" className="hover:text-[#FAF5EC] transition-colors">
                    Espace vendeur
                  </Link>
                </li>
                <li>
                  <Link to="/conditions" className="hover:text-[#FAF5EC] transition-colors">
                    Conditions et conseils de sécurité
                  </Link>
                </li>
                <li>
                  <a
                    href={waLink(
                      SHOP.whatsapp,
                      "Bonjour African Shop, j'ai une question."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#F2BE4B] hover:text-[#FAF5EC] font-semibold transition-colors pt-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Nous écrire sur WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#A89686]">
            <p>
              © {new Date().getFullYear()} African Shop. African Shop met en
              relation acheteurs et commerçants : la vente se conclut
              directement entre eux.
            </p>
            <p className="text-[#D9B89C] font-medium">
              Pensé pour le commerce africain
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-xl border-t border-[#1E1612]/10 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(30,22,18,0.08)]"
      >
        <div className="grid grid-cols-5 h-[66px] items-center">
          {[
            { to: "/", label: "Accueil", icon: Home },
            { to: "/boutiques", label: "Boutiques", icon: Store },
            { to: "/chercher", label: "Chercher", icon: Search },
            { to: "/panier", label: "Panier", icon: ShoppingBag, badge: cartCount },
            { to: user ? "/vendeur" : "/compte", label: "Compte", icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`relative flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors ${
                  active ? "text-[#C84B24]" : "text-[#6E5B4E]"
                }`}
              >
                {active && (
                  <span className="absolute top-0 w-7 h-1 rounded-full bg-[#C84B24]" />
                )}
                <div className="relative">
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.3 : 1.8} />
                  {item.badge ? (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C84B24] text-[#FFFDF9] text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-[86px] md:bottom-6 right-4 left-4 md:left-auto md:max-w-sm z-50"
          >
            <div
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold ${
                toast.tone === "error"
                  ? "bg-[#7A1E15] text-[#FFFDF9] border-[#C84B24]/40"
                  : toast.tone === "info"
                  ? "bg-[#1A2744] text-[#FAF5EC] border-[#F2BE4B]/30"
                  : "bg-[#1C1410] text-[#FAF5EC] border-[#EAB338]/40"
              }`}
            >
              {toast.tone === "error" ? (
                <AlertCircle className="w-5 h-5 text-[#F2BE4B] shrink-0" />
              ) : toast.tone === "info" ? (
                <Info className="w-5 h-5 text-[#F2BE4B] shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#F2BE4B] shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
