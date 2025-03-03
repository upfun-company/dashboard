/**
 * Stories pour le composant Button
 */

import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "_Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "success",
        "warning",
        "info",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    loading: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Bouton par défaut",
    variant: "default",
    size: "default",
  },
};

export const Primary: Story = {
  args: {
    children: "Bouton primaire",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Bouton secondaire",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Bouton contour",
    variant: "outline",
  },
};

export const Destructive: Story = {
  args: {
    children: "Bouton destructif",
    variant: "destructive",
  },
};

export const Success: Story = {
  args: {
    children: "Bouton succès",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Bouton avertissement",
    variant: "warning",
  },
};

export const Info: Story = {
  args: {
    children: "Bouton info",
    variant: "info",
  },
};

export const Ghost: Story = {
  args: {
    children: "Bouton fantôme",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Bouton lien",
    variant: "link",
  },
};

export const Small: Story = {
  args: {
    children: "Petit bouton",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Grand bouton",
    size: "lg",
  },
};

export const Loading: Story = {
  args: {
    children: "Chargement",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Désactivé",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Pleine largeur",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};
