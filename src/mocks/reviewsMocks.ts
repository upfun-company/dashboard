/**
 * Mocks pour les avis (reviews)
 */
import { User } from "./usersMocks";
import { ProviderMock } from "./providersMocks";
import { Service, ReservationNew } from "./reservationsMocks";

/**
 * Type pour un avis
 */
export type Review = {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  reservationId: string;
  rating: number;
  comment: string;
  response?: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt?: string;
  responseDate?: string;
  // Relations
  user?: User;
  provider?: ProviderMock;
  service?: Service;
  reservation?: ReservationNew;
};

/**
 * Génère un mock d'avis
 */
export const generateMockReview = (
  id: number,
  user?: User,
  provider?: ProviderMock,
  service?: Service,
  reservation?: ReservationNew
): Review => {
  // La note détermine le type de commentaire
  const rating = Math.floor(Math.random() * 10) / 2 + 0.5;

  // Date de création (après la date de la réservation)
  const reservationDate = new Date(reservation?.date || Date.now());
  const minReviewDate = new Date(reservationDate);
  minReviewDate.setDate(minReviewDate.getDate() + 1);
  const maxReviewDate = new Date(minReviewDate);
  maxReviewDate.setDate(maxReviewDate.getDate() + 14);
  const createdAt = new Date(
    minReviewDate.getTime() +
      Math.random() * (maxReviewDate.getTime() - minReviewDate.getTime())
  ).toISOString();

  // Date de mise à jour (optionnelle)
  const updatedAt =
    Math.random() > 0.7
      ? new Date(
          new Date(createdAt).getTime() +
            Math.random() * (Date.now() - new Date(createdAt).getTime())
        ).toISOString()
      : undefined;

  // Date de réponse du prestataire (optionnelle)
  const responseDate =
    Math.random() > 0.5
      ? new Date(
          new Date(createdAt).getTime() +
            Math.random() * (Date.now() - new Date(createdAt).getTime())
        ).toISOString()
      : undefined;

  // Statut de l'avis
  const status =
    Math.random() > 0.9
      ? "rejected"
      : Math.random() > 0.8
      ? "pending"
      : "approved";

  let finalProvider = provider;
  if (!finalProvider && reservation) {
    finalProvider = reservation.provider;
  }

  const comment =
    rating >= 4
      ? "Excellent service, je recommande vivement !"
      : rating >= 3
      ? "Bon service dans l'ensemble, quelques points à améliorer."
      : "Service décevant, des améliorations sont nécessaires.";

  const userId = user?.id || reservation?.userId || "user-001";
  const providerId = finalProvider?.id || "provider-001";
  const serviceId = service?.id || reservation?.serviceId || "service-001";
  const reservationId = reservation?.id || "reservation-001";

  return {
    id: `review-${id.toString().padStart(3, "0")}`,
    userId,
    providerId,
    serviceId,
    reservationId,
    rating,
    comment,
    response: responseDate
      ? "Merci pour votre retour, nous prenons en compte vos remarques."
      : undefined,
    status,
    createdAt,
    updatedAt,
    responseDate,
    user: user || reservation?.user,
    provider: finalProvider,
    service: service || reservation?.service,
    reservation: reservation || undefined,
  };
};

/**
 * Génère une liste de mocks d'avis
 */
export const generateMockReviews = (
  count: number,
  completedReservations: ReservationNew[]
): Review[] => {
  const reviews: Review[] = [];

  completedReservations.forEach((reservation) => {
    if (Math.random() > 0.3) {
      reviews.push(
        generateMockReview(
          reviews.length + 1,
          undefined,
          undefined,
          undefined,
          reservation
        )
      );
    }
  });

  return reviews;
};
