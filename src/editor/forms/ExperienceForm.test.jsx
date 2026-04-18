import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CvProvider } from '../../context/CvContext';
import ExperienceForm from './ExperienceForm';

function renderWithContext(ui) {
    return render(<CvProvider>{ui}</CvProvider>);
}

describe('ExperienceForm', () => {
    it('renders section heading', () => {
        renderWithContext(<ExperienceForm />);
        expect(screen.getByText(/work experience/i)).toBeInTheDocument();
    });

    it('shows add button', () => {
        renderWithContext(<ExperienceForm />);
        expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
    });

    it('does not add item when required fields are empty', async () => {
        renderWithContext(<ExperienceForm />);
        const before = screen.queryAllByText(/position/i).length;
        await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
        expect(screen.queryAllByText(/position/i)).toHaveLength(before);
    });

    it('adds a new item when position and company are filled', async () => {
        renderWithContext(<ExperienceForm />);
        await userEvent.type(screen.getByLabelText(/position/i), 'Frontend Dev');
        await userEvent.type(screen.getByLabelText(/company/i), 'ACME Corp');
        await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
        expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
        expect(screen.getByText(/ACME Corp/)).toBeInTheDocument();
    });

    it('clears the form after adding an item', async () => {
        renderWithContext(<ExperienceForm />);
        const positionInput = screen.getByLabelText(/position/i);
        await userEvent.type(positionInput, 'Dev');
        await userEvent.type(screen.getByLabelText(/company/i), 'Co');
        await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
        expect(positionInput).toHaveValue('');
    });
});
