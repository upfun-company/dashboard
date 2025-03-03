# Mocks pour le Dashboard

Ce dossier contient tous les mocks (données de démonstration) utilisés dans l'application dashboard.

## Structure des fichiers

- `index.ts` - Point d'entrée qui exporte tous les mocks et fonctions de génération
- `dashboardMocks.ts` - Mocks pour les statistiques et données du tableau de bord
- `usersMocks.ts` - Mocks pour les utilisateurs et prestataires
- `reservationsMocks.ts` - Mocks pour les services et réservations
- `transactionsMocks.ts` - Mocks pour les transactions financières
- `reviewsMocks.ts` - Mocks pour les avis clients
- `supportMocks.ts` - Mocks pour les tickets de support et messages

## Types de données

### Utilisateurs et Prestataires

- `User` - Utilisateur de la plateforme
- `Provider` - Prestataire de services

### Services et Réservations

- `Service` - Service proposé par un prestataire
- `ReservationNew` - Réservation d'un service par un utilisateur

### Transactions

- `Transaction` - Transaction financière liée à une réservation

### Avis

- `Review` - Avis laissé par un utilisateur sur un service

### Support

- `SupportTicket` - Ticket de support ouvert par un utilisateur ou prestataire
- `SupportMessage` - Message dans un ticket de support

## Utilisation

### Import des données pré-générées

```typescript
import {
  mockUsers,
  mockProviders,
  mockServices,
  mockReservations,
  mockTransactions,
  mockReviews,
  mockSupportTickets,
} from "@/mocks";
```

### Import des fonctions de génération

```typescript
import {
  generateMockUser,
  generateMockUsers,
  generateMockProvider,
  generateMockProviders,
  generateMockService,
  generateMockServices,
  generateNewMockReservations,
  generateMockTransaction,
  generateMockTransactions,
  generateMockReview,
  generateMockReviews,
  generateMockSupportTicket,
  generateMockSupportTickets,
} from "@/mocks";
```

### Génération de données personnalisées

```typescript
// Générer 10 utilisateurs
const users = generateMockUsers(10);

// Générer 5 prestataires
const providers = generateMockProviders(5);

// Générer des services pour ces prestataires
const services = generateMockServices(providers);

// Générer 20 réservations
const reservations = generateNewMockReservations(20);

// Générer des transactions pour ces réservations
const transactions = generateMockTransactions(reservations);

// Générer des avis pour ces réservations
const reviews = generateMockReviews(reservations);

// Générer 10 tickets de support
const supportTickets = generateMockSupportTickets(
  10,
  users,
  providers,
  reservations
);
```
