/**
 * Stories pour le composant CustomersList
 */

import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CustomersList from "./CustomersList";
import customersReducer from "@/redux/reducers/customersReducer";
import { Customer } from "@/types";

// Fonction pour générer des clients mockés
const generateMockCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `cust-${index + 1}`,
    name: `Prénom${index + 1} Nom${index + 1}`,
    email: `client${index + 1}@example.com`,
    phone: `+33 6 12 34 56 ${index.toString().padStart(2, "0")}`,
    createdAt: new Date().toISOString(),
    lastActive: index % 3 === 0 ? new Date().toISOString() : undefined,
    totalSpent: Math.floor(Math.random() * 1000),
    reservationsCount: Math.floor(Math.random() * 10),
    status: index % 5 === 0 ? "inactive" : "active",
    avatarUrl:
      index % 4 === 0 ? `https://i.pravatar.cc/150?u=${index}` : undefined,
  }));
};

// Créer un store mock pour les stories
const createMockStore = () => {
  const mockCustomers = generateMockCustomers(15);

  return configureStore({
    reducer: {
      customers: customersReducer,
    },
    preloadedState: {
      customers: {
        customers: mockCustomers,
        filteredCustomers: mockCustomers,
        selectedCustomer: null,
        pagination: {
          page: 1,
          limit: 10,
          total: mockCustomers.length,
        },
        filters: {
          search: "",
          sortBy: "createdAt",
          sortDirection: "desc" as const,
        },
        isLoading: false,
        error: null,
      },
    },
  });
};

// Créer le store pour les stories
const store = createMockStore();

// Wrapper pour fournir le store Redux
const StoreWrapper = (Story: React.ComponentType) => (
  <Provider store={store}>
    <Story />
  </Provider>
);

const meta = {
  title: "Organisms/CustomersList",
  component: CustomersList,
  parameters: {
    layout: "centered",
  },
  decorators: [StoreWrapper],
  tags: ["autodocs"],
} satisfies Meta<typeof CustomersList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {},
  decorators: [
    (Story) => {
      const loadingStore = configureStore({
        reducer: {
          customers: customersReducer,
        },
        preloadedState: {
          customers: {
            customers: [],
            filteredCustomers: [],
            selectedCustomer: null,
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
            },
            filters: {
              search: "",
              sortBy: "createdAt",
              sortDirection: "desc" as const,
            },
            isLoading: true,
            error: null,
          },
        },
      });

      return (
        <Provider store={loadingStore}>
          <Story />
        </Provider>
      );
    },
  ],
};

export const Empty: Story = {
  args: {},
  decorators: [
    (Story) => {
      const emptyStore = configureStore({
        reducer: {
          customers: customersReducer,
        },
        preloadedState: {
          customers: {
            customers: [],
            filteredCustomers: [],
            selectedCustomer: null,
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
            },
            filters: {
              search: "",
              sortBy: "createdAt",
              sortDirection: "desc" as const,
            },
            isLoading: false,
            error: null,
          },
        },
      });

      return (
        <Provider store={emptyStore}>
          <Story />
        </Provider>
      );
    },
  ],
};
