/**
 * Reducer pour la gestion des tickets de support
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface pour un message de ticket
 */
interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userType: "customer" | "provider" | "admin" | "support";
  userName: string;
  message: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

/**
 * Interface pour un ticket de support
 */
interface Ticket {
  id: string;
  subject: string;
  userId: string;
  userType: "customer" | "provider" | "admin";
  userName: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

/**
 * Interface pour l'état du reducer tickets
 */
interface TicketsState {
  /** Liste des tickets */
  tickets: Ticket[];
  /** Ticket sélectionné */
  selectedTicket: Ticket | null;
  /** Informations de pagination */
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  /** Options de filtrage */
  filters: {
    search: string;
    sortBy: string;
    sortDirection: "asc" | "desc";
    status?: "open" | "in_progress" | "resolved" | "closed" | "all";
    priority?: "low" | "medium" | "high" | "all";
    category?: string;
  };
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer tickets
 */
const initialState: TicketsState = {
  tickets: [],
  selectedTicket: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: "",
    sortBy: "lastMessageAt",
    sortDirection: "desc",
    status: "all",
    priority: "all",
  },
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des tickets
 */
const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des tickets
     */
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    /**
     * Action pour définir un ticket sélectionné
     */
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    updateFilters: (
      state,
      action: PayloadAction<Partial<TicketsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Réinitialiser la pagination lors du changement de filtres
      state.pagination.page = 1;
    },
    /**
     * Action pour définir la page courante
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    /**
     * Action pour définir le nombre d'éléments par page
     */
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Réinitialiser la page lors du changement de limite
    },
    /**
     * Action pour définir l'état de chargement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Action pour définir une erreur
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    /**
     * Action pour ajouter un ticket
     */
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload);
      state.pagination.total += 1;
    },
    /**
     * Action pour mettre à jour un ticket
     */
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket.id === action.payload.id
      );
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      if (
        state.selectedTicket &&
        state.selectedTicket.id === action.payload.id
      ) {
        state.selectedTicket = action.payload;
      }
    },
    /**
     * Action pour supprimer un ticket
     */
    deleteTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload
      );
      state.pagination.total -= 1;
      if (state.selectedTicket && state.selectedTicket.id === action.payload) {
        state.selectedTicket = null;
      }
    },
    /**
     * Action pour ajouter un message à un ticket
     */
    addTicketMessage: (
      state,
      action: PayloadAction<{ ticketId: string; message: TicketMessage }>
    ) => {
      const { ticketId, message } = action.payload;
      const ticketIndex = state.tickets.findIndex(
        (ticket) => ticket.id === ticketId
      );
      if (ticketIndex !== -1) {
        state.tickets[ticketIndex].messages.push(message);
        state.tickets[ticketIndex].lastMessageAt = message.createdAt;
        state.tickets[ticketIndex].updatedAt = message.createdAt;
      }
      if (state.selectedTicket && state.selectedTicket.id === ticketId) {
        state.selectedTicket.messages.push(message);
        state.selectedTicket.lastMessageAt = message.createdAt;
        state.selectedTicket.updatedAt = message.createdAt;
      }
    },
  },
});

// Export des actions
export const {
  setTickets,
  setSelectedTicket,
  updateFilters,
  setPage,
  setLimit,
  setLoading,
  setError,
  addTicket,
  updateTicket,
  deleteTicket,
  addTicketMessage,
} = ticketsSlice.actions;

// Export du reducer
export default ticketsSlice.reducer;
