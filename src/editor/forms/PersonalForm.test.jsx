import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CvProvider } from '../../context/CvContext';
import PersonalForm from './PersonalForm';

function renderWithContext(ui) {
    return render(<CvProvider>{ui}</CvProvider>);
}

describe('PersonalForm', () => {
    it('renders all personal fields', () => {
        renderWithContext(<PersonalForm />);
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/professional summary/i)).toBeInTheDocument();
    });

    it('dispatches UPDATE_PERSONAL_FIELD when name field changes', async () => {
        renderWithContext(<PersonalForm />);
        const nameInput = screen.getByLabelText(/full name/i);
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Jane Smith');
        expect(nameInput).toHaveValue('Jane Smith');
    });
});
