/**
 * Mocks pour les messages de support
 */
import { User } from "./usersMocks";
import { ProviderMock } from "./providersMocks";
import { ReservationNew } from "./reservationsMocks";

/**
 * Type pour un ticket de support
 */
export type SupportTicket = {
  id: string;
  userId?: string;
  providerId?: string;
  reservationId?: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category:
    | "general"
    | "reservation"
    | "payment"
    | "account"
    | "technical"
    | "other";
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  assignedTo?: string;
  // Relations
  user?: User;
  provider?: ProviderMock;
  reservation?: ReservationNew;
  messages: SupportMessage[];
};

/**
 * Type pour un message de support
 */
export type SupportMessage = {
  id: string;
  ticketId: string;
  senderId?: string;
  senderType: "user" | "provider" | "admin" | "system";
  message: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  createdAt: string;
  isRead: boolean;
};

/**
 * Sujets de tickets pour les utilisateurs
 */
const userTicketSubjects = [
  "Problème avec ma réservation",
  "Question sur le paiement",
  "Comment annuler ma réservation ?",
  "Je n'arrive pas à contacter le prestataire",
  "Problème technique avec l'application",
  "Question sur mon compte",
  "Demande de remboursement",
  "Avis non publié",
  "Modification de réservation",
  "Problème avec le prestataire",
];

/**
 * Sujets de tickets pour les prestataires
 */
const providerTicketSubjects = [
  "Problème avec le calendrier",
  "Question sur les commissions",
  "Comment modifier mes services ?",
  "Problème avec les paiements",
  "Demande de vérification de compte",
  "Question sur les avis clients",
  "Problème technique avec le tableau de bord",
  "Comment contacter un client ?",
  "Demande de support marketing",
  "Problème avec mes disponibilités",
];

/**
 * Messages initiaux des utilisateurs
 */
const userInitialMessages = [
  "Bonjour, j'ai un problème avec ma réservation. Pouvez-vous m'aider ?",
  "Je n'arrive pas à effectuer le paiement pour ma réservation. Que dois-je faire ?",
  "Comment puis-je annuler ma réservation et obtenir un remboursement ?",
  "Je n'arrive pas à contacter le prestataire pour ma réservation. Pouvez-vous m'aider ?",
  "L'application ne fonctionne pas correctement sur mon téléphone. Comment résoudre ce problème ?",
  "J'ai oublié mon mot de passe et je n'arrive pas à le réinitialiser. Pouvez-vous m'aider ?",
  "Je souhaite obtenir un remboursement pour une activité annulée. Comment procéder ?",
  "J'ai laissé un avis il y a plusieurs jours mais il n'apparaît toujours pas. Pourquoi ?",
  "Je souhaite modifier la date de ma réservation. Est-ce possible ?",
  "Le prestataire n'était pas présent au rendez-vous. Que dois-je faire ?",
];

/**
 * Messages initiaux des prestataires
 */
const providerInitialMessages = [
  "Bonjour, j'ai un problème avec mon calendrier de disponibilités. Pouvez-vous m'aider ?",
  "Je souhaite comprendre comment sont calculées les commissions sur les réservations.",
  "Comment puis-je modifier les informations de mes services proposés ?",
  "Je n'ai pas reçu le paiement pour une réservation complétée. Pouvez-vous vérifier ?",
  "J'ai soumis mes documents pour la vérification de compte il y a une semaine, mais je n'ai pas de nouvelles.",
  "Un client a laissé un avis négatif injustifié. Comment puis-je le contester ?",
  "Le tableau de bord ne s'affiche pas correctement. Comment résoudre ce problème ?",
  "Comment puis-je contacter directement un client qui a effectué une réservation ?",
  "J'aimerais savoir comment mettre en avant mes services sur la plateforme.",
  "Mes disponibilités ne s'affichent pas correctement pour les clients. Comment corriger cela ?",
];

/**
 * Réponses du support
 */
const supportResponses = [
  "Bonjour, merci de nous avoir contactés. Je comprends votre problème et je vais vous aider à le résoudre.",
  "Bonjour, je suis désolé pour ce désagrément. Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ?",
  "Merci pour votre message. Je vais examiner votre demande et revenir vers vous dans les plus brefs délais.",
  "Bonjour, j'ai bien reçu votre demande. Je vais vérifier cela immédiatement et vous tenir informé.",
  "Je comprends votre préoccupation. Laissez-moi vérifier cela dans notre système et je reviendrai vers vous.",
  "Merci de nous avoir signalé ce problème. Nous allons l'examiner et vous apporter une solution rapidement.",
  "Bonjour, je vais vous guider étape par étape pour résoudre ce problème.",
  "Je suis désolé pour cette situation. Nous allons faire le nécessaire pour résoudre ce problème au plus vite.",
];

/**
 * Réponses de suivi du support
 */
const supportFollowUpResponses = [
  "Suite à notre échange, j'ai vérifié dans notre système et je peux confirmer que...",
  "Après vérification, je peux vous informer que...",
  "Bonne nouvelle ! J'ai pu résoudre votre problème. Voici ce que j'ai fait...",
  "J'ai consulté notre équipe technique et voici leur réponse...",
  "Je viens de mettre à jour votre dossier avec les informations que vous m'avez fournies.",
  "Merci pour votre patience. Nous avons trouvé une solution à votre problème.",
  "Je viens de vérifier avec notre service financier et voici ce qu'ils m'ont indiqué...",
  "Après analyse approfondie, voici ce que nous pouvons vous proposer...",
];

/**
 * Réponses de clôture du support
 */
const supportClosingResponses = [
  "Je suis ravi d'avoir pu résoudre votre problème. N'hésitez pas à nous contacter si vous avez d'autres questions.",
  "Votre problème est maintenant résolu. Merci de votre patience et de votre compréhension.",
  "Je vais maintenant clôturer ce ticket puisque votre problème est résolu. N'hésitez pas à nous recontacter si nécessaire.",
  "Tout semble fonctionner correctement maintenant. Êtes-vous satisfait de la solution apportée ?",
  "Merci de nous avoir fait confiance pour résoudre ce problème. Votre satisfaction est notre priorité.",
  "Je suis heureux d'avoir pu vous aider. Je vais clôturer ce ticket, mais n'hésitez pas à nous recontacter si besoin.",
  "Problème résolu ! N'hésitez pas à nous donner votre avis sur la qualité de notre support.",
  "Merci pour votre patience tout au long de ce processus. Votre problème est maintenant résolu.",
];

/**
 * Génère un mock de ticket de support
 */
export const generateMockSupportTicket = (
  id: number,
  user?: User,
  provider?: ProviderMock,
  reservation?: ReservationNew
): SupportTicket => {
  const isUserTicket =
    user !== undefined && (provider === undefined || Math.random() > 0.5);

  // const ticketCreator = isUserTicket ? user : provider;
  const subject = isUserTicket
    ? userTicketSubjects[Math.floor(Math.random() * userTicketSubjects.length)]
    : providerTicketSubjects[
        Math.floor(Math.random() * providerTicketSubjects.length)
      ];

  const initialMessage = isUserTicket
    ? userInitialMessages[
        Math.floor(Math.random() * userInitialMessages.length)
      ]
    : providerInitialMessages[
        Math.floor(Math.random() * providerInitialMessages.length)
      ];

  // Dates
  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
  ).toISOString();
  const updatedAtDate = new Date(
    new Date(createdAt).getTime() +
      Math.floor(Math.random() * 24 * 60 * 60 * 1000)
  );
  const updatedAt = updatedAtDate.toISOString();

  // Statut
  const status =
    Math.random() > 0.7
      ? "resolved"
      : Math.random() > 0.6
      ? "closed"
      : Math.random() > 0.5
      ? "in_progress"
      : "open";

  // Date de clôture (si applicable)
  let closedAt: string | undefined;
  if (status === "resolved" || status === "closed") {
    const closedAtDate = new Date(
      updatedAtDate.getTime() +
        Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    );
    closedAt = closedAtDate.toISOString();
  }

  // Priorité
  const priority =
    Math.random() > 0.9
      ? "urgent"
      : Math.random() > 0.7
      ? "high"
      : Math.random() > 0.4
      ? "medium"
      : "low";

  // Catégorie
  const category = reservation
    ? "reservation"
    : (["general", "payment", "account", "technical", "other"][
        Math.floor(Math.random() * 5)
      ] as "general" | "payment" | "account" | "technical" | "other");

  // Assigné à (ID d'un admin)
  const assignedTo =
    status !== "open"
      ? `admin-${Math.floor(Math.random() * 5) + 1}`
      : undefined;

  // Messages
  const messages: SupportMessage[] = [];

  // Message initial
  messages.push({
    id: `msg-${id}-1`,
    ticketId: `ticket-${id.toString().padStart(3, "0")}`,
    senderId: isUserTicket ? user?.id : provider?.id,
    senderType: isUserTicket ? "user" : "provider",
    message: initialMessage,
    createdAt,
    isRead: true,
  });

  // Réponse du support (si le statut n'est pas "open")
  if (status !== "open") {
    const supportResponseDate = new Date(
      new Date(createdAt).getTime() +
        Math.floor(Math.random() * 24 * 60 * 60 * 1000)
    );

    messages.push({
      id: `msg-${id}-2`,
      ticketId: `ticket-${id.toString().padStart(3, "0")}`,
      senderId: assignedTo,
      senderType: "admin",
      message:
        supportResponses[Math.floor(Math.random() * supportResponses.length)],
      createdAt: supportResponseDate.toISOString(),
      isRead: true,
    });

    // Réponse de l'utilisateur/prestataire (50% de chance)
    if (Math.random() > 0.5) {
      const userResponseDate = new Date(
        supportResponseDate.getTime() +
          Math.floor(Math.random() * 12 * 60 * 60 * 1000)
      );

      messages.push({
        id: `msg-${id}-3`,
        ticketId: `ticket-${id.toString().padStart(3, "0")}`,
        senderId: isUserTicket ? user?.id : provider?.id,
        senderType: isUserTicket ? "user" : "provider",
        message:
          "Merci pour votre réponse. Voici des informations supplémentaires qui pourraient vous aider...",
        createdAt: userResponseDate.toISOString(),
        isRead: true,
      });

      // Suivi du support
      const followUpDate = new Date(
        userResponseDate.getTime() +
          Math.floor(Math.random() * 24 * 60 * 60 * 1000)
      );

      messages.push({
        id: `msg-${id}-4`,
        ticketId: `ticket-${id.toString().padStart(3, "0")}`,
        senderId: assignedTo,
        senderType: "admin",
        message:
          supportFollowUpResponses[
            Math.floor(Math.random() * supportFollowUpResponses.length)
          ],
        createdAt: followUpDate.toISOString(),
        isRead: true,
      });
    }

    // Message de clôture (si résolu ou fermé)
    if (status === "resolved" || status === "closed") {
      const closingDate = new Date(
        new Date(messages[messages.length - 1].createdAt).getTime() +
          Math.floor(Math.random() * 24 * 60 * 60 * 1000)
      );

      messages.push({
        id: `msg-${id}-${messages.length + 1}`,
        ticketId: `ticket-${id.toString().padStart(3, "0")}`,
        senderId: assignedTo,
        senderType: "admin",
        message:
          supportClosingResponses[
            Math.floor(Math.random() * supportClosingResponses.length)
          ],
        createdAt: closingDate.toISOString(),
        isRead: Math.random() > 0.2, // 20% de chance que le message de clôture ne soit pas lu
      });
    }
  }

  return {
    id: `ticket-${id.toString().padStart(3, "0")}`,
    userId: isUserTicket ? user?.id : undefined,
    providerId: !isUserTicket ? provider?.id : undefined,
    reservationId: reservation?.id,
    subject,
    status,
    priority,
    category,
    createdAt,
    updatedAt,
    closedAt,
    assignedTo,
    user: isUserTicket ? user : undefined,
    provider: !isUserTicket ? provider : undefined,
    reservation,
    messages,
  };
};

/**
 * Génère des mocks de tickets de support
 */
export const generateMockSupportTickets = (
  count: number,
  users: User[],
  providers: ProviderMock[],
  reservations: ReservationNew[]
): SupportTicket[] => {
  const tickets: SupportTicket[] = [];

  for (let i = 0; i < count; i++) {
    const useReservation = Math.random() > 0.6; // 40% des tickets concernent une réservation

    let user: User | undefined;
    let provider: ProviderMock | undefined;
    let reservation: ReservationNew | undefined;

    if (useReservation) {
      reservation =
        reservations[Math.floor(Math.random() * reservations.length)];
      user = reservation.user;
      provider = reservation.provider;
    } else {
      // Ticket sans réservation
      if (Math.random() > 0.5) {
        // Ticket d'utilisateur
        user = users[Math.floor(Math.random() * users.length)];
      } else {
        // Ticket de prestataire
        provider = providers[Math.floor(Math.random() * providers.length)];
      }
    }

    tickets.push(generateMockSupportTicket(i + 1, user, provider, reservation));
  }

  return tickets;
};
