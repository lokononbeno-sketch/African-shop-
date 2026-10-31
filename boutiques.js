/* =====================================================================
   AFRICAN SHOP — tes boutiques et tes produits.
   C'est le SEUL fichier à modifier pour ajouter ou changer une boutique,
   un produit, une catégorie ou les textes légaux.

   RÈGLES SIMPLES
   - Les textes sont entre guillemets "...". N'écris pas de guillemet droit "
     à l'intérieur : utilise « comme ça ».
   - Chaque bloc { ... } est séparé du suivant par une virgule, sauf le dernier.
   - Pour supprimer les mentions « Exemple », retire la ligne exemple: true
     (ou mets false) de la boutique.
   - Photos : envoie l'image sur GitHub dans le même dossier, puis écris son
     nom exact dans photo: "nom.jpg" (ou logo: "nom.png").
   ===================================================================== */

const SHOP = {
  nom: "African Shop",
  slogan: "Le commerce africain, à portée de main.",
  whatsapp: "2290149293939",   // numéro d'African Shop, sans + ni espaces
  offre: "Les conditions (y compris les éventuels tarifs) te sont expliquées sur WhatsApp, avant toute publication."
};

const CATEGORIES = [
  { id: "mode", nom: "Mode", icone: "👗" },
  { id: "beaute", nom: "Beauté", icone: "💄" },
  { id: "alimentation", nom: "Alimentation", icone: "🍲" },
  { id: "electronique", nom: "Électronique", icone: "📱" },
  { id: "maison", nom: "Maison", icone: "🏠" },
  { id: "artisanat", nom: "Artisanat", icone: "🧺" }
];

/* whatsapp: "" signifie « utiliser le numéro d'African Shop » (pratique pour tester).
   Pour une vraie boutique, mets le numéro du commerçant : "2290100000000". */
const BOUTIQUES = [
  {
    id: "exemple-mode",
    nom: "Boutique Exemple Mode",
    exemple: true,
    ville: "Cotonou",
    quartier: "Cadjèhoun",
    categories: ["mode"],
    description: "Pagnes, tenues et accessoires pour toute la famille. Ceci est une boutique d'exemple, à remplacer par une vraie boutique.",
    horaires: "Lundi au samedi · 9h – 19h",
    livraison: "Livraison possible à Cotonou, à convenir avec le commerçant.",
    whatsapp: "",
    logo: ""
  },
  {
    id: "exemple-marche",
    nom: "Marché Exemple",
    exemple: true,
    ville: "Porto-Novo",
    quartier: "Centre-ville",
    categories: ["alimentation", "maison"],
    description: "Produits locaux et articles pour la maison. Ceci est une boutique d'exemple, à remplacer par une vraie boutique.",
    horaires: "Tous les jours · 8h – 18h",
    livraison: "Retrait sur place ou livraison à convenir.",
    whatsapp: "",
    logo: ""
  },
  {
    id: "exemple-beaute",
    nom: "Beauté Exemple",
    exemple: true,
    ville: "Abomey-Calavi",
    quartier: "Godomey",
    categories: ["beaute", "artisanat"],
    description: "Soins naturels et créations artisanales. Ceci est une boutique d'exemple, à remplacer par une vraie boutique.",
    horaires: "Lundi au samedi · 10h – 18h",
    livraison: "Livraison à convenir avec le commerçant.",
    whatsapp: "",
    logo: ""
  }
];

/* dispo: false affiche « Indisponible » et bloque la commande. */
const PRODUITS = [
  { id: "ex-wax", boutique: "exemple-mode", categorie: "mode", nom: "Pagne wax 6 yards", prix: 9500, photo: "", dispo: true,
    description: "Pagne en coton wax aux motifs colorés, 6 yards. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-boubou", boutique: "exemple-mode", categorie: "mode", nom: "Ensemble boubou homme", prix: 18000, photo: "", dispo: true,
    description: "Ensemble deux pièces brodé, plusieurs tailles. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-sandales", boutique: "exemple-mode", categorie: "mode", nom: "Sandales en cuir", prix: 6500, photo: "", dispo: true,
    description: "Sandales en cuir cousues main, du 36 au 45. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-riz", boutique: "exemple-marche", categorie: "alimentation", nom: "Riz local 5 kg", prix: 4500, photo: "", dispo: true,
    description: "Sac de riz local de 5 kg. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-piment", boutique: "exemple-marche", categorie: "alimentation", nom: "Piment moulu 250 g", prix: 1500, photo: "", dispo: true,
    description: "Piment moulu séché au soleil, sachet de 250 g. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-bissap", boutique: "exemple-marche", categorie: "alimentation", nom: "Jus de bissap 1 L", prix: 1000, photo: "", dispo: true,
    description: "Jus de bissap frais, bouteille de 1 litre. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-natte", boutique: "exemple-marche", categorie: "maison", nom: "Natte tressée", prix: 3000, photo: "", dispo: true,
    description: "Natte tressée à la main, idéale pour la maison. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-karite", boutique: "exemple-beaute", categorie: "beaute", nom: "Beurre de karité 250 g", prix: 3500, photo: "", dispo: true,
    description: "Beurre de karité pur pour la peau et les cheveux. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-savon", boutique: "exemple-beaute", categorie: "beaute", nom: "Savon noir artisanal", prix: 1200, photo: "", dispo: true,
    description: "Savon noir artisanal, pain de 150 g. Exemple de produit : remplace-le par un vrai produit." },
  { id: "ex-panier", boutique: "exemple-beaute", categorie: "artisanat", nom: "Panier en raphia", prix: 5500, photo: "", dispo: false,
    description: "Panier tressé en raphia, anses cuir. Exemple de produit indisponible : remplace-le par un vrai produit." }
];

/* Textes légaux et conseils : à relire et à adapter à ta situation. */
const CONDITIONS = [
  ["Le rôle d'African Shop", "African Shop est une vitrine : elle met en relation des acheteurs et des commerçants. African Shop n'est pas le vendeur des produits et n'est pas partie à la vente."],
  ["Commander", "Le bouton « Commander sur WhatsApp » ouvre une conversation avec le commerçant, avec ta commande déjà écrite. La vente se conclut entre toi et lui : prix final, disponibilité, paiement et livraison."],
  ["Acheter en sécurité", "Vérifie le produit avant de payer quand c'est possible. Préfère le paiement à la remise du produit ou en main propre.\nMéfie-toi d'un prix trop beau pour être vrai ou d'une demande d'argent urgente.\nNe partage jamais un code secret de paiement."],
  ["Pour les commerçants", "Tu publies seulement des produits légaux, que tu possèdes réellement, avec des prix et des photos exacts. African Shop peut retirer une boutique ou un produit signalé comme trompeur."],
  ["Signaler un problème", "Écris-nous sur WhatsApp en indiquant le nom de la boutique et le produit concerné."],
  ["Données personnelles", "Le site ne crée pas de compte et ne collecte aucune donnée personnelle. Quand tu ouvres WhatsApp ou un autre lien, tu quittes le site : les règles de ce service s'appliquent."]
];
