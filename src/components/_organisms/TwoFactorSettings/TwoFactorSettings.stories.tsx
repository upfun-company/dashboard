import type { Meta, StoryObj } from "@storybook/react";
import TwoFactorSettings from "./TwoFactorSettings";
import { generateMockAdminUser } from "@/mocks/securityMocks";

const meta: Meta<typeof TwoFactorSettings> = {
  title: "Organisms/TwoFactorSettings",
  component: TwoFactorSettings,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    user: {
      description: "Utilisateur dont on gère les paramètres 2FA",
    },
    onToggle2FA: {
      description:
        "Fonction appelée lors de l'activation/désactivation de la 2FA",
      action: "toggle2FA",
    },
    onChange2FAMethod: {
      description: "Fonction appelée lors du changement de méthode 2FA",
      action: "change2FAMethod",
    },
    onVerifyCode: {
      description: "Fonction appelée lors de la vérification d'un code",
      action: "verifyCode",
    },
    onRegenerateBackupCodes: {
      description:
        "Fonction appelée lors de la régénération des codes de secours",
      action: "regenerateBackupCodes",
    },
    className: {
      description: "Classes CSS additionnelles",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TwoFactorSettings>;

// Utilisateur avec 2FA désactivée
const userWithout2FA = generateMockAdminUser();
userWithout2FA.twoFactorEnabled = false;

// Utilisateur avec 2FA activée (application)
const userWithApp2FA = generateMockAdminUser();
userWithApp2FA.twoFactorEnabled = true;
userWithApp2FA.twoFactorMethod = "app";

// Utilisateur avec 2FA activée (SMS)
const userWithSMS2FA = generateMockAdminUser();
userWithSMS2FA.twoFactorEnabled = true;
userWithSMS2FA.twoFactorMethod = "sms";

// Utilisateur avec 2FA activée (email)
const userWithEmail2FA = generateMockAdminUser();
userWithEmail2FA.twoFactorEnabled = true;
userWithEmail2FA.twoFactorMethod = "email";

export const Disabled: Story = {
  args: {
    user: userWithout2FA,
  },
};

export const EnabledWithApp: Story = {
  args: {
    user: userWithApp2FA,
  },
};

export const EnabledWithSMS: Story = {
  args: {
    user: userWithSMS2FA,
  },
};

export const EnabledWithEmail: Story = {
  args: {
    user: userWithEmail2FA,
  },
};
