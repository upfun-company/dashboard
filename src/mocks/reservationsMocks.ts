/**
 * Mocks pour les réservations
 */
import { User, generateMockUsers } from "./usersMocks";
import { ProviderMock, generateMockProviders } from "./providersMocks";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type PaymentMethod =
  | "card"
  | "paypal"
  | "apple_pay"
  | "google_pay"
  | "bank_transfer";

/**
 * Type pour un service
 */
export type Service = {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutes
  maxParticipants: number;
  minParticipants: number;
  type: "online" | "provider" | "client" | "specific";
  location?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  createdAt: string;
  status: "active" | "inactive" | "pending";
  // Relations
  provider?: ProviderMock;
};

/**
 * Type pour une réservation
 */
export type ReservationNew = {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  amount: number;
  commission: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  refundAmount?: number;
  refundDate?: string;
  // Relations
  user?: User;
  provider?: ProviderMock;
  service?: Service;
};

/**
 * Génère un mock de service
 */
export const generateMockService = (
  serviceId: number,
  providerId: string
): Service => {
  const name = `Service ${serviceId}`;
  const description = `Description du service ${serviceId}`;
  const price = Math.floor(Math.random() * 200) + 50;
  const duration = [30, 60, 90, 120, 180, 240][Math.floor(Math.random() * 6)];
  const maxParticipants = Math.floor(Math.random() * 10) + 1;
  const minParticipants = Math.floor(Math.random() * (maxParticipants - 1)) + 1;
  const locationType = ["online", "provider", "client", "specific"][
    Math.floor(Math.random() * 4)
  ] as "online" | "provider" | "client" | "specific";

  return {
    id: `service-${serviceId.toString().padStart(3, "0")}`,
    providerId,
    name,
    description,
    price,
    duration,
    maxParticipants,
    minParticipants,
    type: locationType,
    location:
      locationType === "specific" ? "123 rue Example, 75001 Paris" : undefined,
    latitude:
      locationType === "specific" ? 48.8566 + Math.random() * 0.1 : undefined,
    longitude:
      locationType === "specific" ? 2.3522 + Math.random() * 0.1 : undefined,
    images: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      (_, i) => `image-${i + 1}.jpg`
    ),
    rating: Math.floor(Math.random() * 10) / 2 + 0.5,
    reviewsCount: Math.floor(Math.random() * 100),
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status:
      Math.random() > 0.8
        ? "pending"
        : Math.random() > 0.1
        ? "active"
        : "inactive",
  };
};

/**
 * Génère un mock de réservation
 */
export const generateMockReservationNew = (
  reservationId: number,
  users: User[],
  providers: ProviderMock[],
  services: Service[]
): ReservationNew => {
  const provider = providers[reservationId % providers.length];
  const service =
    services.find((s) => s.providerId === provider.id) ||
    services[reservationId % services.length];
  const user = users[reservationId % users.length];

  const date = new Date(
    Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  );
  const startTime = `${Math.floor(Math.random() * 12) + 8}:00`;
  const endTime = `${
    parseInt(startTime) + Math.floor(service.duration / 60)
  }:00`;

  const amount = service.price;
  const commission = Math.round(amount * (provider.commissionRate / 100));

  const status = ["pending", "confirmed", "completed", "cancelled", "refunded"][
    Math.floor(Math.random() * 5)
  ] as ReservationStatus;

  const paymentStatus = ["pending", "paid", "refunded", "failed"][
    Math.floor(Math.random() * 4)
  ] as PaymentStatus;

  const paymentMethod = [
    "card",
    "paypal",
    "apple_pay",
    "google_pay",
    "bank_transfer",
  ][Math.floor(Math.random() * 5)] as PaymentMethod;

  return {
    id: `reservation-${reservationId.toString().padStart(3, "0")}`,
    userId: user.id,
    providerId: provider.id,
    serviceId: service.id,
    date: date.toISOString(),
    startTime,
    endTime,
    status,
    amount,
    commission,
    paymentStatus,
    paymentMethod,
    paymentDate:
      paymentStatus === "paid"
        ? new Date(
            date.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    cancellationReason:
      status === "cancelled" ? "Annulation à la demande du client" : undefined,
    cancellationDate:
      status === "cancelled"
        ? new Date(
            date.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    refundAmount:
      status === "refunded"
        ? Math.round(amount * (Math.random() * 0.5 + 0.5))
        : undefined,
    refundDate:
      status === "refunded"
        ? new Date(
            date.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    user,
    provider,
    service,
  };
};

/**
 * Génère des mocks de services pour un ensemble de prestataires
 */
export const generateMockServices = (providers: ProviderMock[]): Service[] => {
  const services: Service[] = [];

  providers.forEach((provider) => {
    const count = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < count; i++) {
      services.push(generateMockService(services.length + 1, provider.id));
    }
  });

  return services;
};

/**
 * Génère des mocks de réservations
 */
export const generateMockReservationsNew = (
  count: number
): ReservationNew[] => {
  const users = generateMockUsers(10);
  const providers = generateMockProviders(15);
  const services = generateMockServices(providers);

  return Array.from({ length: count }, (_, index) =>
    generateMockReservationNew(index + 1, users, providers, services)
  );
};
