import { User, generateMockUsers } from "./usersMocks";
import { ProviderMock, generateMockProviders } from "./providersMocks";
import {
  Service,
  ReservationNew,
  generateMockServices,
  generateMockReservationNew,
} from "./reservationsMocks";
import { Transaction, generateMockTransactions } from "./transactionsMocks";
import { Review, generateMockReviews } from "./reviewsMocks";
import { SupportTicket, generateMockSupportTickets } from "./supportMocks";
import { generateMockActivities } from "./activitiesMocks";
import { Activity } from "@/types";

/**
 * Interface pour les données mockées
 */
export interface MockData {
  users: User[];
  providers: ProviderMock[];
  services: Service[];
  reservations: ReservationNew[];
  transactions: Transaction[];
  reviews: Review[];
  supportTickets: SupportTicket[];
  activities: Activity[];
}

/**
 * Données mockées
 */
export const mockData: MockData = {
  users: [],
  providers: [],
  services: [],
  reservations: [],
  transactions: [],
  reviews: [],
  supportTickets: [],
  activities: [],
};

/**
 * Initialise les données mockées
 */
export const initMockData = () => {
  // Génération des utilisateurs et prestataires
  mockData.users = generateMockUsers(50);
  mockData.providers = generateMockProviders(30);

  // Génération des services
  mockData.services = generateMockServices(mockData.providers);

  // Génération des activités
  mockData.activities = generateMockActivities(40, mockData.providers);

  // Génération des réservations
  mockData.reservations = Array.from({ length: 100 }, (_, index) =>
    generateMockReservationNew(
      index + 1,
      mockData.users,
      mockData.providers,
      mockData.services
    )
  );

  // Génération des transactions
  mockData.transactions = generateMockTransactions(mockData.reservations);

  // Génération des avis
  const completedReservations = mockData.reservations.filter(
    (r) => r.status === "completed"
  );
  mockData.reviews = generateMockReviews(30, completedReservations);

  // Génération des tickets de support
  mockData.supportTickets = generateMockSupportTickets(
    30,
    mockData.users,
    mockData.providers,
    mockData.reservations
  );
};
