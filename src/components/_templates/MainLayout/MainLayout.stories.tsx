/**
 * Stories pour le composant MainLayout
 */

import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import MainLayout from "./MainLayout";

/**
 * Métadonnées pour les stories du composant MainLayout
 */
const meta: Meta<typeof MainLayout> = {
  title: "_Templates/MainLayout",
  component: MainLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story par défaut
 */
export const Default: Story = {
  args: {
    pageTitle: "Tableau de bord",
    children: (
      <div style={{ padding: "20px" }}>
        <h1>Contenu de la page</h1>
        <p>
          Ceci est un exemple de contenu qui serait affiché dans la mise en page
          principale du dashboard.
        </p>
      </div>
    ),
    notificationCount: 3,
    onLogout: fn(),
    user: {
      name: "John Doe",
      role: "Super Admin",
    },
  },
};

/**
 * Story avec beaucoup de notifications
 */
export const WithManyNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 99,
  },
};

/**
 * Story avec avatar utilisateur
 */
export const WithUserAvatar: Story = {
  args: {
    ...Default.args,
    user: {
      name: "Jane Smith",
      role: "Administrateur",
      avatar: "https://i.pravatar.cc/300",
    },
  },
};

/**
 * Story avec contenu complexe
 */
export const WithComplexContent: Story = {
  args: {
    ...Default.args,
    pageTitle: "Statistiques",
    children: (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3>Statistique {i}</h3>
              <p>Valeur: {Math.floor(Math.random() * 1000)}</p>
            </div>
          ))}
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Graphique</h2>
          <div
            style={{
              height: "300px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Graphique de données
          </div>
        </div>
      </div>
    ),
  },
};
