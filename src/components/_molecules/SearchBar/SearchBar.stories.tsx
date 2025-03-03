import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "_Molecules/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSearch: { action: "searched" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: "Rechercher...",
    onSearch: (query) => console.log(`Recherche: ${query}`),
  },
};

export const WithInitialValue: Story = {
  args: {
    placeholder: "Rechercher...",
    initialValue: "Upfun",
    onSearch: (query) => console.log(`Recherche: ${query}`),
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: "Rechercher un utilisateur, une réservation...",
    fullWidth: true,
    onSearch: (query) => console.log(`Recherche: ${query}`),
  },
  parameters: {
    layout: "padded",
  },
};

export const Loading: Story = {
  args: {
    placeholder: "Rechercher...",
    loading: true,
    onSearch: (query) => console.log(`Recherche: ${query}`),
  },
};
