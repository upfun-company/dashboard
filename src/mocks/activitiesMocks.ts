/**
 * Mocks pour les activités
 */

import {
  Activity,
  ActivityStatus,
  RecurrenceType,
  RecurrenceConfig,
  ActivityOccurrence,
} from "@/types";
import { ProviderMock } from "./providersMocks";
import { faker } from "@faker-js/faker/locale/fr";

/**
 * Type pour les images d'activité utilisé dans l'application
 */
interface ActivityImage {
  id: string;
  url: string;
  isMain: boolean;
  alt?: string;
}

/**
 * Type pour la localisation d'une activité
 */
/*interface ActivityLocation {
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}*/

/**
 * Type étendu pour les activités avec des propriétés supplémentaires
 * utilisées dans l'application mais pas dans l'API
 */
/*interface ActivityExtended extends Omit<Activity, "location" | "images"> {
  location: ActivityLocation;
  images: ActivityImage[];
  shortDescription?: string;
  fullDescription?: string;
  categoryIds?: string[];
  name?: string;
  duration?: number;
  rating?: number;
  reviewsCount?: number;
  recurrence?: RecurrenceConfig;
  occurrences?: ActivityOccurrence[];
}*/

/**
 * Catégories d'activités pour les mocks
 */
const ACTIVITY_CATEGORIES = [
  "Sport",
  "Bien-être",
  "Art",
  "Cuisine",
  "Musique",
  "Danse",
  "Technologie",
  "Langues",
  "Nature",
  "Photographie",
];

/**
 * Génère une activité mockée
 */
export const generateMockActivity = (
  id: number,
  providers: ProviderMock[]
): Activity => {
  const provider =
    providers[Math.floor(Math.random() * providers.length)] ||
    providers[0] ||
    ({
      id: "provider-default",
      name: "Prestataire par défaut",
    } as ProviderMock);

  const status = faker.helpers.arrayElement([
    "draft",
    "pending_review",
    "published",
    "rejected",
    "archived",
  ]) as ActivityStatus;

  const minParticipants = Math.floor(Math.random() * 5) + 1;
  const maxParticipants = minParticipants + Math.floor(Math.random() * 15);

  const price = parseFloat(faker.commerce.price({ min: 10, max: 200 }));

  const createdAt = faker.date
    .between({
      from: new Date(2022, 0, 1),
      to: new Date(),
    })
    .toISOString();

  const updatedAt = faker.date
    .between({
      from: new Date(createdAt),
      to: new Date(),
    })
    .toISOString();

  // Générer des images
  const images: ActivityImage[] = [];
  const imageCount = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < imageCount; i++) {
    images.push({
      id: `img-${id}-${i}`,
      url: faker.image.urlLoremFlickr({
        category: faker.helpers.arrayElement([
          "nature",
          "sports",
          "food",
          "people",
          "business",
        ]),
        width: 800,
        height: 600,
      }),
      isMain: i === 0,
      alt: faker.lorem.words(3),
    });
  }

  // Générer une configuration de récurrence aléatoire
  let recurrence: RecurrenceConfig | undefined;
  const hasRecurrence = Math.random() > 0.5;

  if (hasRecurrence) {
    const recurrenceType = faker.helpers.arrayElement([
      "daily",
      "weekly",
      "biweekly",
      "monthly",
    ]) as RecurrenceType;

    const startDate = faker.date.soon({ days: 7 }).toISOString().split("T")[0];
    const endDate = faker.date
      .future({ years: 0.5, refDate: new Date(startDate) })
      .toISOString()
      .split("T")[0];

    recurrence = {
      type: recurrenceType,
      startDate,
      endDate,
      occurrences: Math.floor(Math.random() * 20) + 5,
    };

    if (recurrenceType === "weekly" || recurrenceType === "biweekly") {
      // Jours de la semaine pour la récurrence
      const daysCount = Math.floor(Math.random() * 3) + 1;
      const daysOfWeek: number[] = [];
      for (let i = 0; i < daysCount; i++) {
        const day = Math.floor(Math.random() * 7);
        if (!daysOfWeek.includes(day)) {
          daysOfWeek.push(day);
        }
      }
      recurrence.daysOfWeek = daysOfWeek.sort((a, b) => a - b);
    }
  }

  // Générer des occurrences si l'activité a une récurrence
  const occurrences: ActivityOccurrence[] = [];
  if (recurrence && recurrence.type !== "none") {
    const occurrenceCount = Math.min(
      recurrence.occurrences || 10,
      Math.floor(Math.random() * 10) + 3
    );

    for (let i = 0; i < occurrenceCount; i++) {
      const startDateTime = faker.date.soon({ days: 30 + i * 2 }).toISOString();
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);

      occurrences.push({
        id: `occ-${id}-${i}`,
        activityId: `act-${id}`,
        startDateTime,
        endDateTime: endDateTime.toISOString(),
        availableSpots: Math.floor(Math.random() * maxParticipants),
        totalSpots: maxParticipants,
        hasPromotion: Math.random() > 0.8,
        promotionPercentage:
          Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 5 : undefined,
        status: faker.helpers.arrayElement([
          "available",
          "full",
          "cancelled",
          "completed",
        ]),
      });
    }
  }

  return {
    id: `act-${id}`,
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentence(),
    fullDescription: faker.lorem.paragraphs(3),
    price,
    currency: "EUR",
    durationMinutes: Math.floor(Math.random() * 180) + 30,
    category: faker.helpers.arrayElement(ACTIVITY_CATEGORIES),
    categoryIds: [
      faker.helpers.arrayElement(ACTIVITY_CATEGORIES).toLowerCase(),
      faker.helpers.arrayElement(ACTIVITY_CATEGORIES).toLowerCase(),
    ],
    location: {
      address: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: "France",
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
    providerId: provider.id,
    providerName: provider.name,
    minParticipants,
    maxParticipants,
    status,
    createdAt,
    updatedAt,
    images,
    averageRating:
      Math.random() > 0.3 ? parseFloat((Math.random() * 2 + 3).toFixed(1)) : 0,
    reviewCount: Math.floor(Math.random() * 100),
    bookingCount: Math.floor(Math.random() * 500),
    recurrence,
    occurrences: occurrences.length > 0 ? occurrences : undefined,
  } as Activity;
};

/**
 * Génère plusieurs activités mockées
 */
export const generateMockActivities = (
  count: number,
  providers: ProviderMock[]
): Activity[] => {
  const activities: Activity[] = [];
  for (let i = 0; i < count; i++) {
    activities.push(generateMockActivity(i + 1, providers));
  }
  return activities;
};
