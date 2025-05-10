import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@components/Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Primary Button',
        variant: 'primary',
        size: 'md',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary Button',
        variant: 'secondary',
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        children: 'Large Button',
        variant: 'primary',
        size: 'lg',
    },
};

export const Small: Story = {
    args: {
        children: 'Small Button',
        variant: 'primary',
        size: 'sm',
    },
};
