import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  docs: {
    autodocs: "tag",
  },
  viteFinal(baseConfig) {
    // Merge in the tsconfig-paths plugin so aliases work
    return mergeConfig(baseConfig, {
      plugins: [tsconfigPaths()],
      resolve: {
        alias: {
          "@": "/src",
        },
      },
    });
  },
};

export default config;
