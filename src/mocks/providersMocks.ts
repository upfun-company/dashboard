/**
 * Mocks pour les prestataires
 */

import { format, subDays, subMonths } from "date-fns";

/**
 * Type pour un prestataire
 */
export interface ProviderMock {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  category: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  revenue?: number;
  rating?: number | undefined;
  reservationsCount?: number;
  description?: string;
  phone?: string;
  website?: string;
  avatarUrl?: string;
  commissionRate: number;
}

// Catégories de prestataires
const PROVIDER_CATEGORIES = [
  "Sport & Aventure",
  "Bien-être",
  "Gastronomie",
  "Art & Culture",
  "Éducation",
  "Loisirs",
  "Technologie",
  "Nature",
  "Voyage",
  "Musique",
];

// Villes françaises
const CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Strasbourg",
  "Nantes",
  "Toulouse",
  "Montpellier",
  "Nice",
  "Annecy",
  "Grenoble",
];

/**
 * Génère un prestataire fictif
 * @param id - Identifiant numérique
 * @returns Un objet Provider
 */
export const generateMockProvider = (id: number): ProviderMock => {
  const isActive = Math.random() > 0.2;
  const statusRandom = Math.random();
  let status: "pending" | "approved" | "rejected";

  if (statusRandom < 0.6) {
    status = "approved";
  } else if (statusRandom < 0.9) {
    status = "pending";
  } else {
    status = "rejected";
  }

  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const category =
    PROVIDER_CATEGORIES[Math.floor(Math.random() * PROVIDER_CATEGORIES.length)];
  const createdAt = format(
    subDays(new Date(), Math.floor(Math.random() * 365)),
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );

  const reservationsCount =
    status === "approved" ? Math.floor(Math.random() * 100) : 0;
  const revenue = status === "approved" ? Math.floor(Math.random() * 20000) : 0;
  const rating = status === "approved" ? 3 + Math.random() * 2 : undefined;

  const name = generateProviderName(category);

  return {
    id: `p${id}`,
    name,
    email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.fr`,
    isActive,
    createdAt,
    category,
    location: `${city}, France`,
    status,
    revenue,
    rating,
    reservationsCount,
    phone: generatePhoneNumber(),
    website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.fr`,
    avatarUrl:
      Math.random() > 0.3
        ? `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
          }/${id % 70}.jpg`
        : undefined,
    description: generateDescription(category),
    commissionRate: Math.floor(Math.random() * 15) + 5, // Entre 5% et 20%
  };
};

/**
 * Génère un nom de prestataire basé sur la catégorie
 * @param category - Catégorie du prestataire
 * @returns Nom du prestataire
 */
const generateProviderName = (category: string): string => {
  const prefixes = {
    "Sport & Aventure": ["Aventure", "Extrême", "Sport", "Outdoor", "Action"],
    "Bien-être": ["Zen", "Harmonie", "Équilibre", "Sérénité", "Bien-être"],
    Gastronomie: ["Saveur", "Gourmet", "Cuisine", "Chef", "Délice"],
    "Art & Culture": ["Atelier", "Galerie", "Création", "Expression", "Art"],
    Éducation: ["Académie", "École", "Formation", "Savoir", "Apprentissage"],
    Loisirs: ["Divertissement", "Loisir", "Plaisir", "Récréation", "Détente"],
    Technologie: ["Tech", "Digital", "Numérique", "Innovation", "Futur"],
    Nature: ["Nature", "Éco", "Vert", "Environnement", "Planète"],
    Voyage: ["Voyage", "Évasion", "Découverte", "Exploration", "Aventure"],
    Musique: ["Mélodie", "Rythme", "Musique", "Accord", "Harmonie"],
  };

  const suffixes = [
    "Studio",
    "Expérience",
    "Concept",
    "Lab",
    "Atelier",
    "Club",
    "Academy",
    "Center",
    "Space",
  ];

  const prefix =
    prefixes[category as keyof typeof prefixes] || prefixes["Loisirs"];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  if (Math.random() > 0.5) {
    return `${randomPrefix} ${randomSuffix}`;
  } else {
    return randomPrefix;
  }
};

/**
 * Génère un numéro de téléphone français
 * @returns Numéro de téléphone au format français
 */
const generatePhoneNumber = (): string => {
  return `+33 ${Math.floor(Math.random() * 10)} ${String(
    Math.floor(Math.random() * 100)
  ).padStart(2, "0")} ${String(Math.floor(Math.random() * 100)).padStart(
    2,
    "0"
  )} ${String(Math.floor(Math.random() * 100)).padStart(2, "0")} ${String(
    Math.floor(Math.random() * 100)
  ).padStart(2, "0")}`;
};

/**
 * Génère une description basée sur la catégorie
 * @param category - Catégorie du prestataire
 * @returns Description du prestataire
 */
const generateDescription = (category: string): string => {
  const descriptions = {
    "Sport & Aventure":
      "Spécialiste des activités sportives et d'aventure en plein air. Nous proposons des expériences uniques pour les amateurs de sensations fortes et de nature.",
    "Bien-être":
      "Centre dédié au bien-être et à la relaxation. Nos experts vous accompagnent dans votre quête d'équilibre et de sérénité.",
    Gastronomie:
      "Découvrez l'art culinaire à travers nos ateliers et dégustations. Une expérience gustative unique pour tous les amateurs de bonne cuisine.",
    "Art & Culture":
      "Espace de création et d'expression artistique. Nous proposons des ateliers et des expositions pour tous les passionnés d'art et de culture.",
    Éducation:
      "Centre de formation et d'apprentissage. Nos cours et ateliers sont conçus pour développer vos compétences et votre savoir.",
    Loisirs:
      "Spécialiste des activités de loisirs et de divertissement. Nous proposons des expériences ludiques pour tous les âges.",
    Technologie:
      "Experts en technologies et innovations numériques. Découvrez les dernières avancées technologiques à travers nos ateliers et formations.",
    Nature:
      "Passionnés de nature et d'environnement. Nos activités vous permettent de vous reconnecter avec la nature et de découvrir ses merveilles.",
    Voyage:
      "Spécialistes de l'évasion et de la découverte. Nos voyages et excursions vous feront découvrir des lieux uniques et authentiques.",
    Musique:
      "Centre dédié à la musique et à l'expression sonore. Nos cours et ateliers vous permettront de développer vos talents musicaux.",
  };

  return (
    descriptions[category as keyof typeof descriptions] ||
    "Prestataire de services proposant des activités et expériences uniques."
  );
};

/**
 * Génère une liste de prestataires fictifs
 * @param count - Nombre de prestataires à générer
 * @returns Tableau de prestataires
 */
export const generateMockProviders = (count: number): ProviderMock[] => {
  return Array.from({ length: count }, (_, i) => generateMockProvider(i + 1));
};

/**
 * Génère une liste de prestataires en attente
 * @param count - Nombre de prestataires à générer
 * @returns Tableau de prestataires en attente
 */
export const generateMockPendingProviders = (count: number): ProviderMock[] => {
  return generateMockProviders(count * 2)
    .filter((provider) => provider.status === "pending")
    .slice(0, count);
};

/**
 * Données de prestataires pour les tests et storybooks
 */
export const mockProviders: ProviderMock[] = [
  {
    id: "p1",
    name: "Aventure Outdoor",
    email: "contact@aventure-outdoor.fr",
    isActive: true,
    createdAt: format(subMonths(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    category: "Sport & Aventure",
    location: "Annecy, France",
    status: "approved",
    revenue: 12500,
    rating: 4.8,
    reservationsCount: 45,
    phone: "+33 6 12 34 56 78",
    website: "https://aventure-outdoor.fr",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    description:
      "Spécialiste des activités sportives et d'aventure en plein air. Nous proposons des expériences uniques pour les amateurs de sensations fortes et de nature.",
    commissionRate: Math.floor(Math.random() * 15) + 5,
  },
  {
    id: "p2",
    name: "Yoga Zen Studio",
    email: "contact@yogazenstudio.fr",
    isActive: true,
    createdAt: format(subMonths(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    category: "Bien-être",
    location: "Lyon, France",
    status: "approved",
    revenue: 8700,
    rating: 4.9,
    reservationsCount: 32,
    phone: "+33 6 23 45 67 89",
    website: "https://yogazenstudio.fr",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    description:
      "Centre dédié au bien-être et à la relaxation. Nos experts vous accompagnent dans votre quête d'équilibre et de sérénité.",
    commissionRate: Math.floor(Math.random() * 15) + 5,
  },
  {
    id: "p3",
    name: "Cuisine Créative",
    email: "info@cuisinecreative.fr",
    isActive: true,
    createdAt: format(subDays(new Date(), 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    category: "Gastronomie",
    location: "Paris, France",
    status: "pending",
    revenue: 3200,
    rating: 4.5,
    reservationsCount: 12,
    phone: "+33 6 34 56 78 90",
    website: "https://cuisinecreative.fr",
    avatarUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    description:
      "Découvrez l'art culinaire à travers nos ateliers et dégustations. Une expérience gustative unique pour tous les amateurs de bonne cuisine.",
    commissionRate: Math.floor(Math.random() * 15) + 5,
  },
  {
    id: "p4",
    name: "Tour Historique",
    email: "info@tourhistorique.fr",
    isActive: false,
    createdAt: format(subDays(new Date(), 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    category: "Art & Culture",
    location: "Strasbourg, France",
    status: "rejected",
    revenue: 0,
    rating: undefined,
    reservationsCount: 0,
    phone: "+33 6 45 67 89 01",
    website: "https://tourhistorique.fr",
    avatarUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    description:
      "Espace de création et d'expression artistique. Nous proposons des ateliers et des expositions pour tous les passionnés d'art et de culture.",
    commissionRate: Math.floor(Math.random() * 15) + 5,
  },
  {
    id: "p5",
    name: "École de Musique",
    email: "contact@ecolemusique.fr",
    isActive: true,
    createdAt: format(subDays(new Date(), 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    category: "Éducation",
    location: "Bordeaux, France",
    status: "approved",
    revenue: 6800,
    rating: 4.7,
    reservationsCount: 28,
    phone: "+33 6 56 78 90 12",
    website: "https://ecolemusique.fr",
    avatarUrl: "https://randomuser.me/api/portraits/women/5.jpg",
    description:
      "Centre de formation et d'apprentissage. Nos cours et ateliers sont conçus pour développer vos compétences et votre savoir.",
    commissionRate: Math.floor(Math.random() * 15) + 5,
  },
];
