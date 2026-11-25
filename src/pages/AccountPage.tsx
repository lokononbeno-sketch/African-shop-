import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { AdinkraOrnament } from "../components/AfricanIcons";
import { useStore } from "../context/StoreContext";

export const AccountPage: React.FC = () => {
  const { user, signIn, showToast } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  if (user) {
    navigate("/vendeur", { replace: true });
    return null;
  }

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setOtpSent(true);
    showToast("Code de vérification prêt (code démo : 229229)", "info");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 4) {
      showToast("Entre un code à 6 chiffres (ex. 229229).", "error");
      return;
    }
    signIn(email);
    navigate("/vendeur");
  };

  const handleQuickDemo = () => {
    signIn("atelier@africanshop.bj", "Benoît Lokonon");
    navigate("/vendeur");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <AdinkraOrnament className="w-16 h-3.5 mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E1612]">
          Connexion & Compte
        </h1>
        <p className="text-sm sm:text-base text-[#6E5B4E] mt-1">
          Connecte-toi pour gérer tes boutiques, publier des produits et suivre
          tes commandes.
        </p>
      </div>

      {/* Quick Demo Banner */}
      <div className="mb-6 rounded-3xl bg-[#1C1410] text-[#FAF5EC] bg-bogolan-dark p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F2BE4B]">
            <Sparkles className="w-3.5 h-3.5" />
            Accès rapide
          </p>
          <h2 className="font-display text-xl font-bold">
            Découvrir l’espace vendeur en un clic
          </h2>
          <p className="text-xs sm:text-sm text-[#D6C6B6]">
            Teste la création de boutique, l’ajout de produits et le suivi des
            commandes immédiatement.
          </p>
        </div>
        <button
          type="button"
          onClick={handleQuickDemo}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F2BE4B] text-[#1C1410] font-extrabold text-sm hover:bg-[#FAF5EC] transition-colors cursor-pointer shrink-0"
        >
          Entrer en mode vendeur
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email OTP Card */}
        <div className="rounded-[2rem] bg-[#FFFDF9] border border-[#1E1612]/10 p-6 sm:p-7 shadow-craft">
          <div className="w-11 h-11 rounded-2xl bg-[#FCECE4] text-[#C84B24] flex items-center justify-center mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#1E1612]">
            Connexion par e-mail
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5B4E] mt-1 mb-5">
            Entre ton adresse e-mail pour recevoir un code à usage unique. Ton
            compte est créé automatiquement si besoin.
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5E4D42] mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="w-full px-3.5 py-3 rounded-xl bg-[#FAF5EC] border border-[#1E1612]/12 text-sm focus:outline-none focus:border-[#C84B24]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#C84B24] text-[#FFFDF9] font-bold text-sm hover:bg-[#A63B1A] transition-colors cursor-pointer"
              >
                Recevoir mon code
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#E5F3EC] text-[#1B6B4A] text-xs font-semibold">
                Code envoyé à <strong>{email}</strong> (aperçu :{" "}
                <code>229229</code>)
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5E4D42] mb-1">
                  Code à 6 chiffres
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="229229"
                  className="w-full px-3.5 py-3 rounded-xl bg-[#FAF5EC] border border-[#1E1612]/12 text-base tracking-[0.3em] font-bold text-center focus:outline-none focus:border-[#C84B24]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1B6B4A] text-[#FFFDF9] font-bold text-sm hover:bg-[#135238] transition-colors cursor-pointer"
              >
                Vérifier et me connecter
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs font-bold text-[#6E5B4E] hover:text-[#C84B24] cursor-pointer"
              >
                Changer d’adresse e-mail
              </button>
            </form>
          )}
        </div>

        {/* Phone Login Notice (faithfully matching original repo) */}
        <div className="rounded-[2rem] bg-[#F2E7D5]/60 border border-[#1E1612]/10 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFFDF9] text-[#6E5B4E] flex items-center justify-center mb-4 border border-[#1E1612]/10">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1E1612]">
              Connexion par téléphone
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4D42] mt-1.5 leading-relaxed">
              La connexion téléphonique est en cours de déploiement sécurisé.
              Utilise la connexion par e-mail avec code à usage unique en
              attendant.
            </p>
          </div>

          <div className="mt-6 space-y-3 opacity-60">
            <input
              disabled
              placeholder="+229XXXXXXXX"
              className="w-full px-3.5 py-3 rounded-xl bg-[#FFFDF9] border border-[#1E1612]/10 text-sm"
            />
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-2xl bg-[#1C1410]/20 text-[#1E1612] font-bold text-xs cursor-not-allowed"
            >
              Connexion téléphonique bientôt disponible
            </button>
            <p className="flex items-center gap-1.5 text-[11px] text-[#5E4D42]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ne partage jamais ton mot de passe ni tes codes secrets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
