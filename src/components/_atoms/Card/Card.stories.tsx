/**
 * Stories pour le composant Card
 */

import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";
import Button from "../Button/Button";

/**
 * Métadonnées pour les stories du composant Card
 */
const meta: Meta<typeof Card> = {
  title: "_Atoms/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    withShadow: {
      control: "boolean",
    },
    withBorder: {
      control: "boolean",
    },
    withBackground: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * Story par défaut
 */
export const Default: Story = {
  args: {
    title: "Titre de la carte",
    description: "Description de la carte",
    children: (
      <div className="p-4">
        <p>Contenu de la carte</p>
      </div>
    ),
  },
};

/**
 * Story avec pied
 */
export const WithFooter: Story = {
  args: {
    title: "Carte avec pied",
    description: "Cette carte a un pied avec des actions",
    children: (
      <div className="p-4">
        <p>Contenu de la carte</p>
      </div>
    ),
    footer: (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Annuler
        </Button>
        <Button size="sm">Confirmer</Button>
      </div>
    ),
  },
};

/**
 * Story sans titre
 */
export const WithoutTitle: Story = {
  args: {
    children: (
      <div className="p-4">
        <p>Carte sans titre ni description</p>
      </div>
    ),
  },
};

/**
 * Story sans bordure
 */
export const WithoutBorder: Story = {
  args: {
    title: "Carte sans bordure",
    description: "Cette carte n'a pas de bordure",
    children: (
      <div className="p-4">
        <p>Contenu de la carte</p>
      </div>
    ),
    withBorder: false,
  },
};

/**
 * Story sans ombre
 */
export const WithoutShadow: Story = {
  args: {
    title: "Carte sans ombre",
    description: "Cette carte n'a pas d'ombre",
    children: (
      <div className="p-4">
        <p>Contenu de la carte</p>
      </div>
    ),
    withShadow: false,
  },
};

/**
 * Story sans fond
 */
export const WithoutBackground: Story = {
  args: {
    title: "Carte sans fond",
    description: "Cette carte n'a pas de fond",
    children: (
      <div className="p-4">
        <p>Contenu de la carte</p>
      </div>
    ),
    withBackground: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Story cliquable
 */
export const Clickable: Story = {
  args: {
    title: "Carte cliquable",
    description: "Cliquez sur cette carte pour déclencher une action",
    children: (
      <div className="p-4">
        <p>Contenu de la carte</p>
      </div>
    ),
    onClick: () => alert("Carte cliquée !"),
  },
};

/**
 * Story avec contenu complexe
 */
export const ComplexContent: Story = {
  args: {
    title: "Statistiques",
    description: "Aperçu des performances",
    children: (
      <div className="space-y-4 p-4">
        <div className="flex justify-between">
          <span>Vues</span>
          <span className="font-bold">1,234</span>
        </div>
        <div className="flex justify-between">
          <span>Clics</span>
          <span className="font-bold">567</span>
        </div>
        <div className="flex justify-between">
          <span>Conversions</span>
          <span className="font-bold">89</span>
        </div>
        <div className="h-4 w-full rounded-full bg-gray-200">
          <div className="h-4 w-3/4 rounded-full bg-primary"></div>
        </div>
      </div>
    ),
    footer: (
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Mis à jour il y a 5 min
        </span>
        <Button variant="link" size="sm">
          Voir plus
        </Button>
      </div>
    ),
  },
};
