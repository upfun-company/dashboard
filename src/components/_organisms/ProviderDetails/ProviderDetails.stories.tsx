import type { Meta, StoryObj } from "@storybook/react";
import ProviderDetails from "./ProviderDetails";
import { ProviderExtended } from "@/types/providerExtended";

// Mock du router Next.js
const mockRouter = {
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
};

// Mocking next/navigation
import * as nextNavigation from "next/navigation";
Object.defineProperty(nextNavigation, "useRouter", {
  configurable: true,
  value: () => mockRouter,
});

/**
 * Le composant ProviderDetails affiche les détails complets d'un prestataire,
 * y compris ses informations personnelles, ses statistiques, ses activités,
 * ses réservations et ses avis.
 */
const meta: Meta<typeof ProviderDetails> = {
  title: "Organisms/ProviderDetails",
  component: ProviderDetails,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Affiche les détails complets d'un prestataire avec différents onglets pour visualiser ses informations, activités, réservations et avis.",
      },
    },
    nextjs: {
      router: mockRouter,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
  argTypes: {
    onBack: { action: "retour à la liste" },
    onEdit: { action: "éditer le prestataire" },
    onDelete: { action: "supprimer le prestataire" },
    onApprove: { action: "approuver le prestataire" },
    onReject: { action: "rejeter le prestataire" },
    onViewDocuments: { action: "voir les documents" },
  },
};

export default meta;
type Story = StoryObj<typeof ProviderDetails>;

// Données de test pour un prestataire approuvé avec toutes les informations
const approvedProvider: ProviderExtended = {
  id: "p1",
  name: "Yoga Zen Studio",
  email: "contact@yogazenstudio.fr",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  category: "Bien-être",
  status: "approved",
  isActive: true,
  createdAt: new Date(2022, 5, 15).toISOString(),
  avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  website: "https://yogazenstudio.fr",
  description: "Studio de yoga et bien-être au cœur de Paris",
  rating: 4.8,
  reviewsCount: 124,
  reservationsCount: 256,
  reservationsLastMonth: 32,
  revenue: 15600,
  revenueLastMonth: 2400,
  commission: 2340,
  commissionRate: 15,
  conversionRate: 68,
  viewsCount: 1250,
  reviewsDistribution: {
    1: 2,
    2: 4,
    3: 10,
    4: 28,
    5: 80,
  },
  recentActivities: [
    {
      id: "act1",
      type: "reservation",
      description: "Nouvelle réservation pour 'Yoga Vinyasa'",
      date: new Date(2023, 8, 25).toISOString(),
      icon: "calendar",
    },
    {
      id: "act2",
      type: "review",
      description: "Nouvel avis 5 étoiles reçu",
      date: new Date(2023, 8, 23).toISOString(),
      icon: "star",
    },
    {
      id: "act3",
      type: "activity",
      description: "Nouvelle activité ajoutée: 'Méditation guidée'",
      date: new Date(2023, 8, 20).toISOString(),
      icon: "plus",
    },
  ],
  activities: [
    {
      id: "a1",
      title: "Yoga Vinyasa",
      description:
        "Cours de yoga dynamique pour tous niveaux, axé sur la synchronisation du souffle et du mouvement.",
      price: 25,
      duration: "60",
      rating: 4.9,
      category: "Yoga",
      isActive: true,
      bookingsCount: 45,
      imageUrl:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "a2",
      title: "Méditation guidée",
      description:
        "Session de méditation pour débutants et intermédiaires, guidée par un instructeur expérimenté.",
      price: 20,
      duration: "45",
      rating: 4.7,
      category: "Méditation",
      isActive: true,
      bookingsCount: 32,
      imageUrl:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "a3",
      title: "Yoga prénatal",
      description:
        "Cours spécialement conçu pour les femmes enceintes, adapté à tous les trimestres de grossesse.",
      price: 30,
      duration: "75",
      rating: 4.8,
      category: "Yoga spécialisé",
      isActive: true,
      bookingsCount: 18,
      imageUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ],
  reservations: [
    {
      id: "r1",
      customerName: "Sophie Martin",
      activityTitle: "Yoga Vinyasa",
      date: new Date(2023, 8, 25).toISOString(),
      amount: 25,
      status: "completed",
      participants: 1,
    },
    {
      id: "r2",
      customerName: "Thomas Dubois",
      activityTitle: "Méditation guidée",
      date: new Date(2023, 8, 24).toISOString(),
      amount: 20,
      status: "pending",
      participants: 1,
    },
    {
      id: "r3",
      customerName: "Julie Leroy",
      activityTitle: "Yoga prénatal",
      date: new Date(2023, 8, 22).toISOString(),
      amount: 30,
      status: "cancelled",
      participants: 1,
    },
  ],
  reviews: [
    {
      id: "rv1",
      customerName: "Sophie Martin",
      rating: 5,
      comment:
        "Excellent cours de yoga, très professionnel et dans une ambiance zen. Je recommande vivement !",
      date: new Date(2023, 8, 26).toISOString(),
      activityTitle: "Yoga Vinyasa",
    },
    {
      id: "rv2",
      customerName: "Thomas Dubois",
      rating: 4,
      comment:
        "Très bonne séance de méditation, j'ai apprécié les conseils personnalisés.",
      date: new Date(2023, 8, 24).toISOString(),
      activityTitle: "Méditation guidée",
    },
    {
      id: "rv3",
      customerName: "Émilie Petit",
      rating: 5,
      comment:
        "Le meilleur studio de yoga que j'ai fréquenté à Paris. Instructeurs qualifiés et attentifs.",
      date: new Date(2023, 8, 20).toISOString(),
      activityTitle: "Yoga Vinyasa",
    },
  ],
};

// Données de test pour un prestataire en attente
const pendingProvider: ProviderExtended = {
  id: "p2",
  name: "Aventure Outdoor",
  email: "contact@aventure-outdoor.fr",
  phone: "+33 6 98 76 54 32",
  location: "Lyon, France",
  category: "Sport & Aventure",
  status: "pending",
  isActive: false,
  createdAt: new Date(2023, 8, 10).toISOString(),
  avatarUrl: "",
  website: "https://aventure-outdoor.fr",
  description: "Activités de plein air et d'aventure dans la région lyonnaise",
  rating: 0,
  reviewsCount: 0,
  reservationsCount: 0,
  reservationsLastMonth: 0,
  revenue: 0,
  revenueLastMonth: 0,
  commission: 0,
  commissionRate: 15,
  conversionRate: 0,
  viewsCount: 0,
  activities: [
    {
      id: "a4",
      title: "Randonnée en montagne",
      description:
        "Randonnée guidée dans les montagnes avec un guide expérimenté. Tous niveaux acceptés.",
      price: 45,
      duration: "180",
      rating: 0,
      category: "Randonnée",
      isActive: true,
      bookingsCount: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "a5",
      title: "Escalade en falaise",
      description:
        "Initiation à l'escalade en milieu naturel avec équipement fourni et encadrement professionnel.",
      price: 60,
      duration: "240",
      rating: 0,
      category: "Escalade",
      isActive: true,
      bookingsCount: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ],
};

// Données de test pour un prestataire avec peu d'informations
const minimalProvider: ProviderExtended = {
  id: "p3",
  name: "Cuisine Créative",
  email: "info@cuisinecreative.fr",
  location: "Bordeaux, France",
  category: "Gastronomie",
  status: "approved",
  isActive: true,
  createdAt: new Date(2023, 7, 5).toISOString(),
  description: "Ateliers de cuisine créative à Bordeaux",
  rating: 4.2,
  reviewsCount: 5,
  reservationsCount: 12,
  revenue: 840,
};

export const ApprovedProvider: Story = {
  args: {
    provider: approvedProvider,
  },
};

export const PendingProvider: Story = {
  args: {
    provider: pendingProvider,
    onApprove: (provider) => console.log("Approuver", provider.id),
    onReject: (provider) => console.log("Rejeter", provider.id),
    onViewDocuments: (provider) => console.log("Voir documents", provider.id),
  },
};

export const MinimalProvider: Story = {
  args: {
    provider: minimalProvider,
  },
};

export const WithCallbacks: Story = {
  args: {
    provider: approvedProvider,
    onBack: () => console.log("Retour à la liste"),
    onEdit: (provider) => console.log("Éditer", provider.id),
    onDelete: (providerId) => console.log("Supprimer", providerId),
  },
};
