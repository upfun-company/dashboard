import type { Meta, StoryObj } from "@storybook/react";
import RoleManagement from "./RoleManagement";
import { generateRoleDefinitions } from "@/mocks/securityMocks";

const meta: Meta<typeof RoleManagement> = {
  title: "Organisms/RoleManagement",
  component: RoleManagement,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    roles: {
      description: "Liste des rôles à afficher",
    },
    onCreateRole: {
      description: "Fonction appelée lors de la création d'un rôle",
      action: "createRole",
    },
    onUpdateRole: {
      description: "Fonction appelée lors de la mise à jour d'un rôle",
      action: "updateRole",
    },
    onDeleteRole: {
      description: "Fonction appelée lors de la suppression d'un rôle",
      action: "deleteRole",
    },
    className: {
      description: "Classes CSS additionnelles",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RoleManagement>;

export const Default: Story = {
  args: {
    roles: generateRoleDefinitions(),
  },
};

export const Empty: Story = {
  args: {
    roles: [],
  },
};
