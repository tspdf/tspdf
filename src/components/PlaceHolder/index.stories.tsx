import type { Meta, StoryObj } from '@storybook/react';
import { PlaceHolder } from '.';

const meta: Meta<typeof PlaceHolder> = {
  title: 'Example/PlaceHolder',
  component: PlaceHolder,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'PlaceHolder',
  },
};