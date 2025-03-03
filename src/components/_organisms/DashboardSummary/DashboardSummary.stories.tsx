import type { Meta, StoryObj } from "@storybook/react";
import DashboardSummary from "./DashboardSummary";
import { Users, ShoppingCart, CreditCard, TrendingUp } from "lucide-react";
import { Stat } from "@/components/_organisms/StatsList";
import { Alert } from "@/components/_organisms/AlertsList";
import { Event } from "@/components/_organisms/EventsList";
import { PendingProvider } from "@/components/_organisms/PendingProvidersList";
import {
  ReservationChartData,
  RevenueChartData,
  UsersChartData,
} from "@/components/_organisms/DashboardCharts";

const meta: Meta<typeof DashboardSummary> = {
  title: "Organisms/DashboardSummary",
  component: DashboardSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onStatClick: { action: "stat clicked" },
    onAlertClick: { action: "alert clicked" },
    onEventClick: { action: "event clicked" },
    onProviderApprove: { action: "provider approved" },
    onProviderReject: { action: "provider rejected" },
    onProviderDetails: { action: "provider details viewed" },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardSummary>;

// Données pour les statistiques
const mockStats: Stat[] = [
  {
    id: "users",
    title: "Utilisateurs",
    value: "1,234",
    change: 12.5,
    icon: Users,
    iconColor: "primary",
  },
  {
    id: "reservations",
    title: "Réservations",
    value: "856",
    change: 8.2,
    icon: ShoppingCart,
    iconColor: "success",
  },
  {
    id: "revenue",
    title: "Chiffre d'affaires",
    value: "45,678 €",
    change: -2.4,
    icon: CreditCard,
    iconColor: "warning",
  },
  {
    id: "growth",
    title: "Croissance",
    value: "15.3%",
    change: 5.1,
    icon: TrendingUp,
    iconColor: "info",
  },
];

// Données pour les graphiques
const mockReservationData: ReservationChartData[] = [
  { name: "Jan", value: 65 },
  { name: "Fév", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Avr", value: 81 },
  { name: "Mai", value: 56 },
  { name: "Juin", value: 95 },
  { name: "Juil", value: 120 },
];

const mockRevenueData: RevenueChartData[] = [
  { name: "Jan", revenue: 4000, commission: 400 },
  { name: "Fév", revenue: 3000, commission: 300 },
  { name: "Mar", revenue: 5000, commission: 500 },
  { name: "Avr", revenue: 4500, commission: 450 },
  { name: "Mai", revenue: 3500, commission: 350 },
  { name: "Juin", revenue: 6000, commission: 600 },
  { name: "Juil", revenue: 7500, commission: 750 },
];

const mockUsersData: UsersChartData[] = [
  { name: "Jan", nouveaux: 40, actifs: 240 },
  { name: "Fév", nouveaux: 30, actifs: 260 },
  { name: "Mar", nouveaux: 45, actifs: 290 },
  { name: "Avr", nouveaux: 50, actifs: 320 },
  { name: "Mai", nouveaux: 35, actifs: 340 },
  { name: "Juin", nouveaux: 60, actifs: 380 },
  { name: "Juil", nouveaux: 75, actifs: 420 },
];

// Données pour les alertes
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "reservation",
    message:
      "Une nouvelle réservation a été effectuée et nécessite votre attention",
    severity: "info",
    date: today.toISOString(),
  },
  {
    id: "2",
    type: "payment",
    message: "Un paiement a échoué pour la réservation #12345",
    severity: "error",
    date: yesterday.toISOString(),
  },
  {
    id: "3",
    type: "provider",
    message: "Un nouveau prestataire s'est inscrit et attend validation",
    severity: "warning",
    date: lastWeek.toISOString(),
  },
];

// Données pour les événements
const mockEvents: Event[] = [
  {
    id: "1",
    type: "reservation",
    title: "Nouvelle réservation #12345",
    description: "Une nouvelle réservation a été effectuée par Jean Dupont",
    date: today.toISOString(),
  },
  {
    id: "2",
    type: "user",
    title: "Nouvel utilisateur inscrit",
    description: "Marie Martin vient de créer un compte",
    date: yesterday.toISOString(),
  },
  {
    id: "3",
    type: "payment",
    title: "Paiement reçu",
    description: "Un paiement de 120€ a été reçu pour la réservation #12345",
    date: lastWeek.toISOString(),
  },
];

// Données pour les prestataires en attente
const mockPendingProviders: PendingProvider[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    category: "Plomberie",
    registrationDate: "15 juin 2023",
    status: "pending",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    category: "Électricité",
    registrationDate: "10 mai 2023",
    status: "pending",
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    category: "Jardinage",
    registrationDate: "5 avril 2023",
    status: "pending",
  },
];

export const Default: Story = {
  args: {
    stats: mockStats,
    reservationData: mockReservationData,
    revenueData: mockRevenueData,
    userData: mockUsersData,
    alerts: mockAlerts,
    events: mockEvents,
    pendingProviders: mockPendingProviders,
  },
};

export const WithCallbacks: Story = {
  args: {
    stats: mockStats,
    reservationData: mockReservationData,
    revenueData: mockRevenueData,
    userData: mockUsersData,
    alerts: mockAlerts,
    events: mockEvents,
    pendingProviders: mockPendingProviders,
    onStatClick: (statId) => console.log(`Stat clicked: ${statId}`),
    onAlertClick: (alertId) => console.log(`Alert clicked: ${alertId}`),
    onEventClick: (eventId) => console.log(`Event clicked: ${eventId}`),
    onProviderApprove: (providerId) =>
      console.log(`Provider approved: ${providerId}`),
    onProviderReject: (providerId) =>
      console.log(`Provider rejected: ${providerId}`),
    onProviderDetails: (providerId) =>
      console.log(`Provider details: ${providerId}`),
  },
};
