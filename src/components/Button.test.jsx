import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Save</Button>);
        await userEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('applies primary variant classes by default', () => {
        render(<Button>Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
    });

    it('applies danger variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });

    it('applies secondary variant classes', () => {
        render(<Button variant="secondary">Cancel</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
    });

    it('defaults to type="button" to avoid accidental form submission', () => {
        render(<Button>No submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
});
