import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "_Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Entrez du texte",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Nom d'utilisateur",
    placeholder: "Entrez votre nom d'utilisateur",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Email",
    placeholder: "Entrez votre email",
    helperText: "Nous ne partagerons jamais votre email avec des tiers.",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Mot de passe",
    placeholder: "Entrez votre mot de passe",
    type: "password",
    error: "Le mot de passe doit contenir au moins 8 caractères",
  },
};

export const Disabled: Story = {
  args: {
    label: "Champ désactivé",
    placeholder: "Vous ne pouvez pas modifier ce champ",
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: "Champ obligatoire",
    placeholder: "Ce champ est obligatoire",
    required: true,
  },
};

export const WithStartIcon: Story = {
  args: {
    label: "Recherche",
    placeholder: "Rechercher...",
    startIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
};

export const WithEndIcon: Story = {
  args: {
    label: "Mot de passe",
    placeholder: "Entrez votre mot de passe",
    type: "password",
    endIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
};

export const WithBothIcons: Story = {
  args: {
    label: "Recherche avancée",
    placeholder: "Rechercher...",
    startIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    endIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M3 12h18" />
        <path d="M3 18h18" />
      </svg>
    ),
  },
};
