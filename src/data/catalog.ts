export interface Category {
  id: string;
  nom: string;
  sousTitre: string;
  accent: string;
  bgTint: string;
}

export interface Boutique {
  id: string;
  nom: string;
  exemple?: boolean;
  verifie?: boolean;
  ville: string;
  quartier: string;
  categories: string[];
  description: string;
  horaires: string;
  livraison: string;
  whatsapp: string;
  logo?: string;
  cover?: string;
  couleur: string;
  ownerEmail?: string;
  status?: "active" | "pending";
}

export interface Product {
  id: string;
  boutique: string;
  categorie: string;
  nom: string;
  prix: number;
  photo: string;
  dispo: boolean;
  stock?: number;
  description: string;
  origine?: string;
  badge?: string;
  exemple?: boolean;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "rejected";

export interface LocalOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  buyerName: string;
  buyerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  totalFcfa: number;
  items: {
    productId: string;
    boutiqueId: string;
    title: string;
    priceFcfa: number;
    quantity: number;
    status: OrderStatus;
  }[];
}

export const SHOP = {
  nom: "African Shop",
  slogan: "Le commerce africain, à portée de main.",
  whatsapp: "2290149293939",
  offre:
    "Les conditions (y compris les éventuels tarifs) te sont expliquées sur WhatsApp, avant toute publication.",
};

export const CATEGORIES: Category[] = [
  {
    id: "mode",
    nom: "Mode",
    sousTitre: "Wax, boubous & cuir",
    accent: "#C84B24",
    bgTint: "#FCECE4",
  },
  {
    id: "beaute",
    nom: "Beauté",
    sousTitre: "Karité & soins purs",
    accent: "#B87A14",
    bgTint: "#FBF1DC",
  },
  {
    id: "alimentation",
    nom: "Alimentation",
    sousTitre: "Épices, bissap & terroir",
    accent: "#1B6B4A",
    bgTint: "#E5F3EC",
  },
  {
    id: "electronique",
    nom: "Électronique",
    sousTitre: "Audio & accessoires",
    accent: "#1A2744",
    bgTint: "#E7ECF5",
  },
  {
    id: "maison",
    nom: "Maison",
    sousTitre: "Nattes & décoration",
    accent: "#9C4A22",
    bgTint: "#F7EAE2",
  },
  {
    id: "artisanat",
    nom: "Artisanat",
    sousTitre: "Raphia, laiton & art",
    accent: "#7B3420",
    bgTint: "#F5E7E2",
  },
];

export const INITIAL_BOUTIQUES: Boutique[] = [
  {
    id: "exemple-mode",
    nom: "Atelier Wax & Élégance",
    verifie: true,
    ville: "Cotonou",
    quartier: "Cadjèhoun",
    categories: ["mode"],
    description:
      "Pagnes wax authentiques, boubous brodés main et sandales en cuir façonnées au Bénin pour sublimer toute la famille.",
    horaires: "Lundi au samedi · 9h – 19h",
    livraison: "Livraison express à Cotonou & retrait en atelier.",
    whatsapp: "",
    cover: "images/prod-wax.png",
    couleur: "#C84B24",
    status: "active",
  },
  {
    id: "exemple-marche",
    nom: "Saveurs & Grenier du Terroir",
    verifie: true,
    ville: "Porto-Novo",
    quartier: "Centre-ville",
    categories: ["alimentation", "maison"],
    description:
      "Riz local récolté au Bénin, épices séchées au soleil, bissap frais préparé chaque matin et nattes tressées pour votre intérieur.",
    horaires: "Tous les jours · 8h – 18h30",
    livraison: "Retrait sur place ou livraison à Porto-Novo & Cotonou.",
    whatsapp: "",
    cover: "images/prod-bissap.png",
    couleur: "#1B6B4A",
    status: "active",
  },
  {
    id: "exemple-beaute",
    nom: "Trésors de Karité & Raphia",
    verifie: true,
    ville: "Abomey-Calavi",
    quartier: "Godomey",
    categories: ["beaute", "artisanat"],
    description:
      "Beurre de karité brut du Nord, savon noir artisanal, bijoux en laiton martelé et vannerie tressée à la main.",
    horaires: "Lundi au samedi · 9h30 – 18h30",
    livraison: "Livraison partout à Calavi et Cotonou sur rendez-vous.",
    whatsapp: "",
    cover: "images/prod-karite.png",
    couleur: "#D9911A",
    status: "active",
  },
  {
    id: "cotonou-connect",
    nom: "Cotonou Connect Studio",
    verifie: true,
    ville: "Cotonou",
    quartier: "Haie Vive",
    categories: ["electronique"],
    description:
      "Accessoires audio sans fil, chargeurs fiables et équipements mobiles testés et garantis avant la remise en main propre.",
    horaires: "Lundi au samedi · 9h – 20h",
    livraison: "Livraison le jour même à Cotonou, paiement à la remise.",
    whatsapp: "",
    cover: "images/prod-ecouteurs.png",
    couleur: "#1A2744",
    status: "active",
  },
];

export const INITIAL_PRODUITS: Product[] = [
  {
    id: "ex-wax",
    boutique: "exemple-mode",
    categorie: "mode",
    nom: "Pagne wax 6 yards",
    prix: 9500,
    photo: "images/prod-wax.png",
    dispo: true,
    stock: 18,
    origine: "Cotonou · 100 % Coton",
    badge: "Coup de cœur",
    description:
      "Pagne en coton wax aux motifs géométriques chaleureux, 6 yards. Couleurs éclatantes qui tiennent au lavage, idéal pour robes, chemises et tenues de cérémonie.",
  },
  {
    id: "ex-boubou",
    boutique: "exemple-mode",
    categorie: "mode",
    nom: "Ensemble boubou homme",
    prix: 18000,
    photo: "images/prod-boubou.png",
    dispo: true,
    stock: 9,
    origine: "Cadjèhoun · Broderie or",
    badge: "Édition artisanale",
    description:
      "Ensemble deux pièces en coton indigo profond avec broderie géométrique dorée à l'encolure. Coupe ample et respirante, disponible du M au XXL.",
  },
  {
    id: "ex-sandales",
    boutique: "exemple-mode",
    categorie: "mode",
    nom: "Sandales en cuir cousues main",
    prix: 6500,
    photo: "images/prod-sandales.png",
    dispo: true,
    stock: 14,
    origine: "Cuir tanné · 36 au 45",
    description:
      "Sandales en cuir cognac entièrement cousues à la main par nos cordonniers. Semelle souple et résistante pour le quotidien, pointures du 36 au 45.",
  },
  {
    id: "ex-karite",
    boutique: "exemple-beaute",
    categorie: "beaute",
    nom: "Beurre de karité pur 250 g",
    prix: 3500,
    photo: "images/prod-karite.png",
    dispo: true,
    stock: 30,
    origine: "Natitingou · Non raffiné",
    badge: "100 % Naturel",
    description:
      "Beurre de karité pur et non raffiné, baratté artisanalement. Nourrit intensément la peau et revitalise les cheveux secs.",
  },
  {
    id: "ex-savon",
    boutique: "exemple-beaute",
    categorie: "beaute",
    nom: "Savon noir artisanal 150 g",
    prix: 1200,
    photo: "images/prod-savon.png",
    dispo: true,
    stock: 42,
    origine: "Abomey-Calavi · Doux",
    description:
      "Savon noir traditionnel préparé aux huiles végétales locales, pain de 150 g lié au raphia. Nettoie en douceur et laisse la peau lumineuse.",
  },
  {
    id: "ex-bissap",
    boutique: "exemple-marche",
    categorie: "alimentation",
    nom: "Jus de bissap frais 1 L",
    prix: 1000,
    photo: "images/prod-bissap.png",
    dispo: true,
    stock: 25,
    origine: "Porto-Novo · Fait maison",
    badge: "Frais du jour",
    description:
      "Infusion artisanale de fleurs d'hibiscus légèrement parfumée à la menthe fraîche, bouteille de 1 litre prête à déguster bien fraîche.",
  },
  {
    id: "ex-piment",
    boutique: "exemple-marche",
    categorie: "alimentation",
    nom: "Piment moulu 250 g",
    prix: 1500,
    photo: "images/prod-piment.png",
    dispo: true,
    stock: 36,
    origine: "Séché au soleil",
    description:
      "Piment rouge local récolté à maturité, séché au soleil puis finement moulu. Sachet hermétique de 250 g au parfum relevé.",
  },
  {
    id: "ex-riz",
    boutique: "exemple-marche",
    categorie: "alimentation",
    nom: "Riz local du terroir 5 kg",
    prix: 4500,
    photo: "images/prod-riz.png",
    dispo: true,
    stock: 22,
    origine: "Récolte locale · Trié",
    description:
      "Sac de 5 kg de riz local trié avec soin, grains fermes et savoureux qui accompagnent parfaitement vos sauces traditionnelles.",
  },
  {
    id: "ex-natte",
    boutique: "exemple-marche",
    categorie: "maison",
    nom: "Natte tressée géométrique",
    prix: 3000,
    photo: "images/prod-natte.png",
    dispo: true,
    stock: 11,
    origine: "Fait main · Fibre naturelle",
    description:
      "Natte tressée à la main aux motifs losanges ocre et ébène. Apporte une touche chaleureuse et authentique au salon ou à la terrasse.",
  },
  {
    id: "ex-collier",
    boutique: "exemple-beaute",
    categorie: "artisanat",
    nom: "Collier laiton & perles d'argile",
    prix: 8500,
    photo: "images/prod-collier.png",
    dispo: true,
    stock: 6,
    origine: "Pièce artisanale · Laiton",
    badge: "Pièce unique",
    description:
      "Collier plastron façonné à la main mêlant laiton doré martelé et perles en terre cuite. Élégance contemporaine ancrée dans l'artisanat ouest-africain.",
  },
  {
    id: "ex-ecouteurs",
    boutique: "cotonou-connect",
    categorie: "electronique",
    nom: "Écouteurs sans fil Or & Obsidienne",
    prix: 14500,
    photo: "images/prod-ecouteurs.png",
    dispo: true,
    stock: 12,
    origine: "Haie Vive · Testés sur place",
    badge: "Nouveauté",
    description:
      "Écouteurs Bluetooth haute clarté avec boîtier de charge compact noir mat et finitions dorées. Autonomie jusqu'à 24 h avec boîtier.",
  },
  {
    id: "ex-panier",
    boutique: "exemple-beaute",
    categorie: "artisanat",
    nom: "Panier en raphia & anses cuir",
    prix: 5500,
    photo: "images/prod-panier.png",
    dispo: false,
    stock: 0,
    origine: "Vannerie du Bénin",
    description:
      "Grand panier tressé à la main en raphia naturel rehaussé de bandes terracotta et indigo, avec anses gainées de cuir véritable.",
  },
];

export const CONDITIONS: [string, string][] = [
  [
    "Le rôle d'African Shop",
    "African Shop est une vitrine : elle met en relation des acheteurs et des commerçants. African Shop n'est pas le vendeur des produits et n'est pas partie à la vente.",
  ],
  [
    "Commander",
    "Le bouton « Commander sur WhatsApp » ouvre une conversation avec le commerçant, avec ta commande déjà écrite. La vente se conclut entre toi et lui : prix final, disponibilité, paiement et livraison.",
  ],
  [
    "Acheter en sécurité",
    "Vérifie le produit avant de payer quand c'est possible. Préfère le paiement à la remise du produit ou en main propre.\nMéfie-toi d'un prix trop beau pour être vrai ou d'une demande d'argent urgente.\nNe partage jamais un code secret de paiement.",
  ],
  [
    "Pour les commerçants",
    "Tu publies seulement des produits légaux, que tu possèdes réellement, avec des prix et des photos exacts. African Shop peut retirer une boutique ou un produit signalé comme trompeur.",
  ],
  [
    "Signaler un problème",
    "Écris-nous sur WhatsApp en indiquant le nom de la boutique et le produit concerné.",
  ],
  [
    "Données personnelles",
    "Quand tu ouvres WhatsApp ou un autre lien externe, tu quittes le site : les règles de ce service s'appliquent. Ton panier est conservé localement sur ton appareil.",
  ],
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_confirmation: "À confirmer",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready_for_pickup: "Prête au retrait",
  out_for_delivery: "En livraison",
  delivered: "Livrée",
  rejected: "Refusée",
};

export const ORDER_STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending_confirmation: ["confirmed", "rejected"],
  confirmed: ["preparing"],
  preparing: ["ready_for_pickup", "out_for_delivery"],
  ready_for_pickup: ["delivered"],
  out_for_delivery: ["delivered"],
};

export function fmtFCFA(amount: number): string {
  return Number(amount || 0).toLocaleString("fr-FR") + " FCFA";
}

export function normText(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getInitials(name: string): string {
  return (
    String(name || "AS")
      .replace(/[^\p{L}\s]/gu, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "AS"
  );
}

export function formatLieu(b: Pick<Boutique, "quartier" | "ville">): string {
  return [b.quartier, b.ville].filter(Boolean).join(", ");
}

export function getWhatsAppNumber(b?: Boutique | null): string {
  const cleaned = (b?.whatsapp || SHOP.whatsapp).replace(/[^\d]/g, "");
  return cleaned || SHOP.whatsapp;
}

export function waLink(phone: string, message: string): string {
  const cleaned = (phone || SHOP.whatsapp).replace(/[^\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildProductOrderWhatsApp(
  product: Product,
  boutique: Boutique | undefined,
  quantity: number
): string {
  const url = `${window.location.origin}${window.location.pathname}#/p/${product.id}`;
  const msg = `Bonjour ${boutique ? boutique.nom : "African Shop"} 👋\nJe souhaite commander :\n• ${product.nom} × ${quantity}\nTotal : ${fmtFCFA(product.prix * quantity)}\n(vu sur African Shop : ${url})\nPouvez-vous me confirmer la disponibilité, le paiement et la livraison ?`;
  return waLink(getWhatsAppNumber(boutique), msg);
}
