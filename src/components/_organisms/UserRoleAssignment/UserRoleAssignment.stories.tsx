import type { Meta, StoryObj } from "@storybook/react";
import { UserRoleAssignment } from "./UserRoleAssignment";
import { generateMockAdminUsers } from "@/mocks/securityMocks";
import { Role, AdminUser } from "@/types/security";
import { AccountStatus } from "@/types/users";

// Convertir les utilisateurs mockés pour correspondre au type AdminUser
const mockUsers = generateMockAdminUsers(15).map((user) => ({
  ...user,
  status: user.status === "inactive" ? "blocked" : ("active" as AccountStatus),
})) as AdminUser[];

const meta: Meta<typeof UserRoleAssignment> = {
  title: "Organisms/UserRoleAssignment",
  component: UserRoleAssignment,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composant pour gérer les rôles des utilisateurs administrateurs et inviter de nouveaux utilisateurs.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-6 max-w-7xl mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    users: {
      description: "Liste des utilisateurs administrateurs",
    },
    availableRoles: {
      description: "Liste des rôles disponibles",
    },
    onAssignRole: {
      description: "Fonction appelée lors de l'attribution d'un rôle",
      action: "assignRole",
    },
    onInviteUser: {
      description: "Fonction appelée lors de l'invitation d'un utilisateur",
      action: "inviteUser",
    },
    className: {
      description: "Classes CSS additionnelles",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserRoleAssignment>;

export const Default: Story = {
  args: {
    users: mockUsers,
    availableRoles: Object.values(Role),
  },
};

export const WithCallbacks: Story = {
  args: {
    users: mockUsers,
    availableRoles: Object.values(Role),
    onAssignRole: async (userId, role) => {
      console.log(`Assigner le rôle ${role} à l'utilisateur ${userId}`);
      return true;
    },
    onInviteUser: async (email, role) => {
      console.log(`Inviter l'utilisateur ${email} avec le rôle ${role}`);
      return true;
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Exemple avec toutes les fonctions de callback définies pour les actions sur les utilisateurs.",
      },
    },
  },
};

export const Empty: Story = {
  args: {
    users: [],
    availableRoles: Object.values(Role),
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple sans utilisateurs.",
      },
    },
  },
};

export const LimitedRoles: Story = {
  args: {
    users: mockUsers,
    availableRoles: [Role.ADMIN, Role.CONTENT_MANAGER, Role.VIEWER],
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple avec un ensemble limité de rôles disponibles.",
      },
    },
  },
};
