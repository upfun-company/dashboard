/**
 * Point d'entrée pour les données mockées
 * @module mocks
 */

/**
 * Export de tous les mocks
 */

// Mocks pour les utilisateurs
export * from "./usersMocks";

// Mocks pour les prestataires
export {
  generateMockProvider,
  generateMockProviders,
  generateMockPendingProviders,
  type ProviderMock as Provider,
} from "./providersMocks";

// Mocks pour les réservations et services
export {
  generateMockReservationNew,
  generateMockReservationsNew,
  generateMockService,
  generateMockServices,
  type Service,
  type ReservationNew,
} from "./reservationsMocks";

// Mocks pour les transactions
export * from "./transactionsMocks";

// Mocks pour les avis
export * from "./reviewsMocks";

// Mocks pour le support
export * from "./supportMocks";

// Mocks pour les activités
export * from "./activitiesMocks";

// Mocks pour les promotions
export * from "./promotionsMocks";

// Mocks pour les analytics
export * from "./analyticsConversionMocks";
export {
  availableReports,
  getReportById,
  getReportsByCategory,
  reportsRevenueChartData,
  userChartData,
} from "./analyticsReportsMocks";
export { locationDistributionData as locationDistributionDataReservations } from "./analyticsReservationsMocks";
export * from "./analyticsRevenueMocks";
export * from "./analyticsUsersMocks";

// Export des données mockées
export { mockData } from "./mockData";

// Export des mocks du dashboard
export * from "./dashboardMocks";

// Export des mocks financiers
export * from "./financeMocks";

// Export des mocks de sécurité
export * from "./securityMocks";
