import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import AnalyticsDataTable, { AnalyticsColumn } from "./AnalyticsDataTable";

const meta: Meta<typeof AnalyticsDataTable> = {
  title: "Organisms/AnalyticsDataTable",
  component: AnalyticsDataTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AnalyticsDataTable>;

// Données de démonstration
interface DemoData {
  id: string;
  name: string;
  status: string;
  amount: number;
  date: string;
  category: string;
  location: string;
}

const demoData: DemoData[] = [
  {
    id: "1",
    name: "Réservation #12345",
    status: "confirmé",
    amount: 125.5,
    date: "2023-05-15",
    category: "Activité sportive",
    location: "Paris",
  },
  {
    id: "2",
    name: "Réservation #12346",
    status: "en attente",
    amount: 75.0,
    date: "2023-05-16",
    category: "Atelier créatif",
    location: "Lyon",
  },
  {
    id: "3",
    name: "Réservation #12347",
    status: "annulé",
    amount: 200.0,
    date: "2023-05-17",
    category: "Visite guidée",
    location: "Marseille",
  },
  {
    id: "4",
    name: "Réservation #12348",
    status: "confirmé",
    amount: 150.75,
    date: "2023-05-18",
    category: "Activité sportive",
    location: "Bordeaux",
  },
  {
    id: "5",
    name: "Réservation #12349",
    status: "confirmé",
    amount: 95.25,
    date: "2023-05-19",
    category: "Atelier créatif",
    location: "Lille",
  },
];

// Colonnes de démonstration
const demoColumns: AnalyticsColumn<DemoData>[] = [
  {
    id: "name",
    header: "Nom",
    accessorFn: (row) => row.name,
    sortable: true,
    filterable: true,
  },
  {
    id: "status",
    header: "Statut",
    accessorFn: (row) => row.status,
    cell: (value) => {
      const status = value as string;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
            status === "confirmé"
              ? "bg-green-100 text-green-800"
              : status === "en attente"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </div>
      );
    },
    sortable: true,
    filterable: true,
  },
  {
    id: "amount",
    header: "Montant",
    accessorFn: (row) => row.amount,
    format: "currency",
    align: "right",
    sortable: true,
  },
  {
    id: "date",
    header: "Date",
    accessorFn: (row) => row.date,
    cell: (value) => {
      const date = new Date(value as string);
      return new Intl.DateTimeFormat("fr-FR").format(date);
    },
    sortable: true,
  },
  {
    id: "category",
    header: "Catégorie",
    accessorFn: (row) => row.category,
    sortable: true,
    filterable: true,
  },
  {
    id: "location",
    header: "Lieu",
    accessorFn: (row) => row.location,
    sortable: true,
    filterable: true,
  },
];

// Histoire par défaut
export const Default: Story = {
  args: {
    data: demoData,
    columns: demoColumns,
    title: "Tableau des réservations",
  },
};

// Avec pagination
export const WithPagination: Story = {
  args: {
    data: demoData,
    columns: demoColumns,
    title: "Tableau avec pagination",
    currentPage: 1,
    totalPages: 3,
    pageSize: 2,
    totalItems: 6,
    onPageChange: (page) => console.log(`Page changed to ${page}`),
    onPageSizeChange: (size) => console.log(`Page size changed to ${size}`),
  },
};

// Avec sélection
export const WithSelection: Story = {
  args: {
    data: demoData,
    columns: demoColumns,
    title: "Tableau avec sélection",
    enableSelection: true,
    onSelectionChange: (selectedRows) =>
      console.log("Selected rows:", selectedRows),
  },
};

// En cours de chargement
export const Loading: Story = {
  args: {
    data: [],
    columns: demoColumns,
    title: "Tableau en chargement",
    isLoading: true,
  },
};

// Vide
export const Empty: Story = {
  args: {
    data: [],
    columns: demoColumns,
    title: "Tableau vide",
  },
};

// Avec clic sur les lignes
export const WithRowClick: Story = {
  args: {
    data: demoData,
    columns: demoColumns,
    title: "Tableau avec clic sur les lignes",
    onRowClick: (row) => console.log("Row clicked:", row),
  },
};

// Avec export
export const WithExport: Story = {
  args: {
    data: demoData,
    columns: demoColumns,
    title: "Tableau avec export",
    onExport: (format) => console.log(`Exporting in ${format} format`),
  },
};
