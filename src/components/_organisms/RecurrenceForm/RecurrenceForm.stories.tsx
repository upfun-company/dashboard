import type { Meta, StoryObj } from "@storybook/react";
import {
  RecurrenceForm,
  RecurrenceConfig,
  ActivityOccurrence,
} from "./RecurrenceForm";
import { useState } from "react";

const meta: Meta<typeof RecurrenceForm> = {
  title: "Organisms/RecurrenceForm",
  component: RecurrenceForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[1000px] p-6 border rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecurrenceForm>;

/**
 * Type pour les props du composant RecurrenceFormWithState
 */
interface RecurrenceFormWithStateProps {
  activityDuration: number;
  maxCapacity: number;
  activityId: string;
  initialConfig?: RecurrenceConfig;
}

/**
 * Wrapper pour gérer l'état du formulaire de récurrence
 */
const RecurrenceFormWithState = (props: RecurrenceFormWithStateProps) => {
  const [config, setConfig] = useState<RecurrenceConfig>(
    props.initialConfig || {
      type: "none",
      startDate: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
    }
  );

  // Stocke les occurrences générées (utilisé pour le débogage)
  const [, setOccurrences] = useState<ActivityOccurrence[]>([]);

  const handleChange = (
    newConfig: RecurrenceConfig,
    newOccurrences: ActivityOccurrence[]
  ) => {
    setConfig(newConfig);
    setOccurrences(newOccurrences);
    console.log("Nouvelle configuration:", newConfig);
    console.log("Nouvelles occurrences:", newOccurrences);
  };

  return (
    <RecurrenceForm {...props} initialConfig={config} onChange={handleChange} />
  );
};

/**
 * Configuration par défaut
 */
export const Default: Story = {
  render: () => (
    <RecurrenceFormWithState
      activityDuration={60}
      maxCapacity={10}
      activityId="activity-123"
    />
  ),
};

/**
 * Configuration quotidienne
 */
export const Daily: Story = {
  render: () => (
    <RecurrenceFormWithState
      activityDuration={60}
      maxCapacity={10}
      activityId="activity-123"
      initialConfig={{
        type: "daily",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endTime: "11:00",
        interval: 1,
      }}
    />
  ),
};

/**
 * Configuration hebdomadaire
 */
export const Weekly: Story = {
  render: () => (
    <RecurrenceFormWithState
      activityDuration={90}
      maxCapacity={15}
      activityId="activity-123"
      initialConfig={{
        type: "weekly",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "14:00",
        endTime: "15:30",
        daysOfWeek: [1, 3, 5], // Lundi, Mercredi, Vendredi
        interval: 1,
      }}
    />
  ),
};

/**
 * Configuration bi-hebdomadaire
 */
export const Biweekly: Story = {
  render: () => (
    <RecurrenceFormWithState
      activityDuration={120}
      maxCapacity={8}
      activityId="activity-123"
      initialConfig={{
        type: "biweekly",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "18:00",
        endTime: "20:00",
        daysOfWeek: [2, 4], // Mardi, Jeudi
      }}
    />
  ),
};

/**
 * Configuration mensuelle
 */
export const Monthly: Story = {
  render: () => (
    <RecurrenceFormWithState
      activityDuration={180}
      maxCapacity={20}
      activityId="activity-123"
      initialConfig={{
        type: "monthly",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "12:00",
        monthlyType: "dayOfMonth",
        interval: 1,
      }}
    />
  ),
};

/**
 * Configuration avec exceptions
 */
export const WithExceptions: Story = {
  render: () => {
    // Calculer les dates d'exception (3 jours et 10 jours après la date actuelle)
    const today = new Date();
    const exception1 = new Date(today);
    exception1.setDate(today.getDate() + 3);
    const exception2 = new Date(today);
    exception2.setDate(today.getDate() + 10);

    return (
      <RecurrenceFormWithState
        activityDuration={60}
        maxCapacity={12}
        activityId="activity-123"
        initialConfig={{
          type: "weekly",
          startDate: today.toISOString().split("T")[0],
          startTime: "16:00",
          endTime: "17:00",
          daysOfWeek: [1, 2, 3, 4, 5], // Lundi à Vendredi
          exceptions: [
            exception1.toISOString().split("T")[0],
            exception2.toISOString().split("T")[0],
          ],
        }}
      />
    );
  },
};

/**
 * Configuration avec nombre limité d'occurrences
 */
export const LimitedOccurrences: Story = {
  render: () => (
    <RecurrenceFormWithState
      activityDuration={45}
      maxCapacity={6}
      activityId="activity-123"
      initialConfig={{
        type: "daily",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "07:00",
        endTime: "07:45",
        interval: 1,
        occurrences: 5,
      }}
    />
  ),
};

/**
 * Configuration avec date de fin
 */
export const WithEndDate: Story = {
  render: () => {
    // Calculer la date de fin (30 jours après la date actuelle)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    return (
      <RecurrenceFormWithState
        activityDuration={60}
        maxCapacity={15}
        activityId="activity-123"
        initialConfig={{
          type: "weekly",
          startDate: today.toISOString().split("T")[0],
          startTime: "19:00",
          endTime: "20:00",
          daysOfWeek: [1, 4], // Lundi et Jeudi
          endDate: endDate.toISOString().split("T")[0],
        }}
      />
    );
  },
};
