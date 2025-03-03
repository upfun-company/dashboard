/**
 * Mocks pour les utilisateurs et les prestataires
 */

/**
 * Type pour un utilisateur
 */
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: "active" | "inactive" | "pending";
  lastLogin?: string;
  lastReservation?: string;
  avatar?: string;
  reservationsCount: number;
  totalSpent: number;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
};

/**
 * Génère un mock d'utilisateur
 */
export const generateMockUser = (id: number): User => {
  const firstName = [
    "Jean",
    "Marie",
    "Pierre",
    "Sophie",
    "Thomas",
    "Camille",
    "Nicolas",
    "Julie",
    "David",
    "Émilie",
    "Antoine",
    "Laura",
    "François",
    "Céline",
    "Michel",
    "Nathalie",
  ][id % 16];

  const lastName = [
    "Dupont",
    "Martin",
    "Durand",
    "Leroy",
    "Moreau",
    "Simon",
    "Laurent",
    "Michel",
    "Lefebvre",
    "Garcia",
    "David",
    "Bertrand",
    "Roux",
    "Vincent",
    "Fournier",
    "Morel",
  ][id % 16];

  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 31536000000)
  )
    .toISOString()
    .split("T")[0];
  const lastLogin =
    Math.random() > 0.2
      ? new Date(
          Date.now() - Math.floor(Math.random() * 2592000000)
        ).toISOString()
      : undefined;
  const reservationsCount = Math.floor(Math.random() * 20);
  const totalSpent = Math.floor(Math.random() * 2000) + 50;

  const status =
    Math.random() > 0.9
      ? "inactive"
      : Math.random() > 0.8
      ? "pending"
      : "active";

  // Ajouter une date de dernière réservation pour certains utilisateurs
  const hasReservation = Math.random() > 0.3; // 70% des utilisateurs ont une réservation
  const lastReservation = hasReservation
    ? new Date(
        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
      ).toISOString()
    : undefined;

  return {
    id: `user-${id.toString().padStart(3, "0")}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+33${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10000000
    )
      .toString()
      .padStart(8, "0")}`,
    createdAt,
    status,
    lastLogin,
    lastReservation,
    avatar:
      Math.random() > 0.7 ? undefined : `https://i.pravatar.cc/150?u=${id}`,
    reservationsCount,
    totalSpent,
    address:
      Math.random() > 0.2
        ? {
            street: `${Math.floor(Math.random() * 100) + 1} rue ${
              [
                "de la Paix",
                "Victor Hugo",
                "des Lilas",
                "Saint-Michel",
                "de la République",
              ][id % 5]
            }`,
            city: [
              "Paris",
              "Lyon",
              "Marseille",
              "Bordeaux",
              "Lille",
              "Nantes",
              "Strasbourg",
              "Toulouse",
            ][id % 8],
            zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
            country: "France",
          }
        : undefined,
  };
};

/**
 * Génère une liste de mocks d'utilisateurs
 */
export const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }).map((_, index) =>
    generateMockUser(index + 1)
  );
};

/**
 * Génère une liste de clients mockés
 * @param count - Nombre de clients à générer
 * @returns Liste des clients mockés
 */
export const generateMockCustomers = (count: number = 10): User[] => {
  return Array.from({ length: count }, (_, index) => generateMockUser(index));
};
