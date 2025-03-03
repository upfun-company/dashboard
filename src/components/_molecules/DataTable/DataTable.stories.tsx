import type { Meta, StoryObj } from "@storybook/react";
import DataTable, { Column } from "./DataTable";
import Badge from "@/components/_atoms/Badge/Badge";

// Définir un type User local pour les stories
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

const meta = {
  title: "_Molecules/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onRowClick: { action: "row clicked" },
  },
} as Meta<typeof DataTable<User>>;

export default meta;
type Story = StoryObj<typeof meta>;

// Données de test pour les exemples
const mockUsers: User[] = Array.from({ length: 25 }).map((_, index) => ({
  id: `user-${index + 1}`,
  name: `Utilisateur ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: index % 3 === 0 ? "Admin" : index % 3 === 1 ? "Éditeur" : "Utilisateur",
  status: index % 4 === 0 ? "inactive" : index % 4 === 1 ? "pending" : "active",
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0],
}));

// Colonnes pour l'exemple
const columns: Column<User>[] = [
  {
    id: "name",
    header: "Nom",
    cell: (user: User) => user.name,
    sortable: true,
  },
  {
    id: "email",
    header: "Email",
    cell: (user: User) => user.email,
    sortable: true,
  },
  {
    id: "role",
    header: "Rôle",
    cell: (user: User) => user.role,
    sortable: true,
  },
  {
    id: "status",
    header: "Statut",
    cell: (user: User) => {
      const variant =
        user.status === "active"
          ? "success"
          : user.status === "inactive"
          ? "destructive"
          : "warning";

      return (
        <Badge variant={variant}>
          {user.status === "active"
            ? "Actif"
            : user.status === "inactive"
            ? "Inactif"
            : "En attente"}
        </Badge>
      );
    },
    sortable: true,
  },
  {
    id: "createdAt",
    header: "Date de création",
    cell: (user: User) => user.createdAt,
    sortable: true,
  },
];

export const Default: Story = {
  args: {
    data: mockUsers,
    columns,
    getRowId: (user: User) => user.id,
    pageSize: 5,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    getRowId: (user: User) => user.id,
    pageSize: 5,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    getRowId: (user: User) => user.id,
    emptyMessage: "Aucun utilisateur trouvé",
  },
};

export const WithRowClick: Story = {
  args: {
    data: mockUsers,
    columns,
    getRowId: (user: User) => user.id,
    pageSize: 5,
    onRowClick: (user: User) =>
      console.log(`Utilisateur sélectionné: ${user.name}`),
  },
};
