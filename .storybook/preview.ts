import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import { decorators } from "./decorators";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#fafafa",
        },
        {
          name: "dark",
          value: "#272727",
        },
      ],
    },
    layout: "centered",
    docs: {
      autodocs: false,
    },
    options: {
      storySort: {
        order: ["Introduction", "Components", "*"],
      },
    },
  },
  decorators,
};

export default preview;
