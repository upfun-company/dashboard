import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "_Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "success",
        "warning",
        "info",
      ],
    },
    clickable: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Badge secondaire",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Badge destructif",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Badge contour",
    variant: "outline",
  },
};

export const Success: Story = {
  args: {
    children: "Badge succès",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Badge avertissement",
    variant: "warning",
  },
};

export const Info: Story = {
  args: {
    children: "Badge info",
    variant: "info",
  },
};

export const Clickable: Story = {
  args: {
    children: "Badge cliquable",
    clickable: true,
    onClick: () => alert("Badge cliqué !"),
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <span className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        Badge avec icône
      </span>
    ),
  },
};
