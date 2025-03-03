import type { Meta, StoryObj } from "@storybook/react";
import { ActivityCalendar } from "./ActivityCalendar";
import { Activity, ActivityOccurrence, RecurrenceType } from "@/types";
import { addDays } from "date-fns";

// Fonction pour créer une date ISO à partir de la date actuelle + un nombre de jours
const createDate = (daysToAdd: number = 0): string => {
  const date = addDays(new Date(), daysToAdd);
  return date.toISOString();
};

// Fonction pour créer des occurrences de test
const createOccurrences = (
  activityId: string,
  count: number = 5
): ActivityOccurrence[] => {
  const occurrences: ActivityOccurrence[] = [];

  for (let i = 0; i < count; i++) {
    const day = i * 2; // Espacer les occurrences tous les 2 jours
    const date = addDays(new Date(), day);

    // Créer une heure de début (9h) et de fin (11h)
    const startDateTime = new Date(date);
    startDateTime.setHours(9, 0, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(11, 0, 0, 0);

    occurrences.push({
      id: `occ-${activityId}-${i}`,
      activityId,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      availableSpots: 8,
      totalSpots: 10,
      hasPromotion: i % 3 === 0, // Une promotion tous les 3 événements
      promotionPercentage: i % 3 === 0 ? 15 : undefined,
      status: i % 4 === 0 ? "full" : i % 5 === 0 ? "cancelled" : "available",
    });
  }

  return occurrences;
};

// Type pour les activités avec récurrence pour les stories
type ActivityWithRecurrence = Omit<Activity, "recurrence" | "occurrences"> & {
  recurrence: {
    type: RecurrenceType;
    startDate: string;
    endDate: string;
    occurrences?: number;
    daysOfWeek?: number[];
  };
  occurrences: ActivityOccurrence[];
};

// Activité de test avec récurrence quotidienne
const activityWithDailyRecurrence: ActivityWithRecurrence = {
  id: "act-daily",
  title: "Cours de yoga quotidien",
  description: "Séance de yoga pour tous les niveaux, tous les jours",
  shortDescription: "Yoga quotidien pour tous",
  fullDescription:
    "Rejoignez-nous pour une séance de yoga quotidienne adaptée à tous les niveaux. Notre instructeur expérimenté vous guidera à travers une série de postures pour améliorer votre force, votre flexibilité et votre bien-être général.",
  price: 15,
  currency: "EUR",
  durationMinutes: 60,
  category: "Bien-être",
  location: {
    address: "15 rue de la Paix",
    postalCode: "75001",
    city: "Paris",
    country: "France",
  },
  providerId: "provider-1",
  providerName: "Yoga Studio Paris",
  maxParticipants: 10,
  minParticipants: 3,
  status: "published",
  createdAt: createDate(-30),
  updatedAt: createDate(-2),
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
      isMain: true,
      alt: "Cours de yoga",
    },
  ],
  averageRating: 4.8,
  reviewCount: 24,
  bookingCount: 156,
  recurrence: {
    type: "daily",
    startDate: createDate(0),
    endDate: createDate(30),
    occurrences: 30,
  },
  occurrences: createOccurrences("act-daily", 10),
};

// Activité de test avec récurrence hebdomadaire
const activityWithWeeklyRecurrence: ActivityWithRecurrence = {
  id: "act-weekly",
  title: "Atelier de peinture",
  description: "Atelier de peinture hebdomadaire pour adultes",
  shortDescription: "Peinture hebdomadaire",
  fullDescription:
    "Venez développer votre créativité lors de notre atelier de peinture hebdomadaire. Tous les matériaux sont fournis, et notre artiste résident vous guidera à travers différentes techniques et styles.",
  price: 35,
  currency: "EUR",
  durationMinutes: 120,
  category: "Art",
  location: {
    address: "8 rue des Arts",
    postalCode: "75004",
    city: "Paris",
    country: "France",
  },
  providerId: "provider-2",
  providerName: "Atelier des Arts",
  maxParticipants: 8,
  minParticipants: 2,
  status: "published",
  createdAt: createDate(-60),
  updatedAt: createDate(-5),
  images: [
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      isMain: true,
      alt: "Atelier de peinture",
    },
  ],
  averageRating: 4.5,
  reviewCount: 18,
  bookingCount: 72,
  recurrence: {
    type: "weekly",
    startDate: createDate(0),
    endDate: createDate(60),
    daysOfWeek: [1, 3], // Lundi et Mercredi
    occurrences: 16,
  },
  occurrences: createOccurrences("act-weekly", 8),
};

// Activité sans récurrence
const activityWithoutRecurrence: Omit<Activity, "occurrences"> & {
  occurrences: ActivityOccurrence[];
} = {
  id: "act-single",
  title: "Concert de jazz",
  description: "Concert de jazz exceptionnel",
  shortDescription: "Concert unique",
  price: 25,
  currency: "EUR",
  durationMinutes: 180,
  category: "Musique",
  location: {
    address: "Salle de concert Le Méridien",
    postalCode: "75008",
    city: "Paris",
    country: "France",
  },
  providerId: "provider-3",
  providerName: "Productions Musicales",
  maxParticipants: 200,
  minParticipants: 10,
  status: "published",
  createdAt: createDate(-15),
  updatedAt: createDate(-15),
  images: [
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      isMain: true,
      alt: "Concert de jazz",
    },
  ],
  averageRating: 0,
  reviewCount: 0,
  bookingCount: 45,
  occurrences: [
    {
      id: "occ-single-1",
      activityId: "act-single",
      startDateTime: createDate(10),
      endDateTime: createDate(10),
      availableSpots: 155,
      totalSpots: 200,
      hasPromotion: false,
      status: "available",
    },
  ],
};

const meta = {
  title: "Organisms/ActivityCalendar",
  component: ActivityCalendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onOccurrenceEdit: { action: "occurrenceEdit" },
    onOccurrenceAdd: { action: "occurrenceAdd" },
  },
} satisfies Meta<typeof ActivityCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DailyRecurrence: Story = {
  args: {
    activity: activityWithDailyRecurrence,
  },
};

export const WeeklyRecurrence: Story = {
  args: {
    activity: activityWithWeeklyRecurrence,
  },
};

export const NoRecurrence: Story = {
  args: {
    activity: activityWithoutRecurrence,
  },
};

export const WithActions: Story = {
  args: {
    activity: activityWithDailyRecurrence,
    onOccurrenceEdit: undefined, // Sera remplacé par l'action définie dans argTypes
    onOccurrenceAdd: undefined, // Sera remplacé par l'action définie dans argTypes
  },
};

export const EmptyCalendar: Story = {
  args: {
    activity: {
      ...activityWithoutRecurrence,
      occurrences: [],
    },
  },
};
