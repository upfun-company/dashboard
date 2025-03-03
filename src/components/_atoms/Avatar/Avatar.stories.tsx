import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "_Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Avatar de l'utilisateur",
    size: "md",
  },
};

export const WithFallback: Story = {
  args: {
    fallback: "John Doe",
    alt: "Avatar de John Doe",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Avatar de l'utilisateur",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Avatar de l'utilisateur",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Avatar de l'utilisateur",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Avatar de l'utilisateur",
    size: "xl",
  },
};

export const WithInitials: Story = {
  args: {
    fallback: "John Doe",
    alt: "Avatar avec initiales",
    size: "lg",
  },
};

export const WithCustomClass: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "Avatar avec classe personnalisée",
    className: "border-2 border-primary",
    size: "lg",
  },
};
