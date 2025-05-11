import type { Meta, StoryObj } from "@storybook/react";

import { DocumentContainer } from "@/index";

const meta: Meta<typeof DocumentContainer> = {
  title: "Components/DocumentContainer",
  component: DocumentContainer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DocumentContainer>;

export const Default: Story = {
  // no args—this will render page 1 of the default PDF
};
