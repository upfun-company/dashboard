import type { Meta, StoryObj } from "@storybook/react";
import AlertsList from "./AlertsList";
import { Alert } from "./AlertsList";

const meta: Meta<typeof AlertsList> = {
  title: "Organisms/AlertsList",
  component: AlertsList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onAlertClick: { action: "alert clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof AlertsList>;

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "reservation",
    message:
      "Une nouvelle réservation a été effectuée et nécessite votre attention",
    severity: "info",
    date: "2023-06-15T14:30:00Z",
  },
  {
    id: "2",
    type: "payment",
    message: "Un paiement a échoué pour la réservation #12345",
    severity: "error",
    date: "2023-06-14T10:15:00Z",
  },
  {
    id: "3",
    type: "provider",
    message: "Un nouveau prestataire s'est inscrit et attend validation",
    severity: "warning",
    date: "2023-06-13T09:45:00Z",
  },
  {
    id: "4",
    type: "system",
    message: "La maintenance du système a été effectuée avec succès",
    severity: "success",
    date: "2023-06-12T22:00:00Z",
  },
  {
    id: "5",
    type: "system",
    message: "Une mise à jour importante du système est prévue pour demain",
    severity: "warning",
    date: "2023-06-11T16:30:00Z",
  },
];

export const Default: Story = {
  args: {
    alerts: mockAlerts,
    title: "Alertes administratives",
    maxAlerts: 5,
  },
};

export const WithClickHandler: Story = {
  args: {
    alerts: mockAlerts,
    title: "Alertes administratives",
    maxAlerts: 5,
    onAlertClick: (alert) => console.log("Alert clicked:", alert),
  },
};

export const LimitedAlerts: Story = {
  args: {
    alerts: mockAlerts,
    title: "Alertes récentes",
    maxAlerts: 3,
  },
};

export const Empty: Story = {
  args: {
    alerts: [],
    title: "Alertes administratives",
  },
};
