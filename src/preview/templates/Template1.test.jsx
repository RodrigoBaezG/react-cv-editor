import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CvContext } from '../../context/CvContext';
import Template1 from './Template1';

const mockState = {
    personal: {
        nombre: 'Test User',
        titulo: 'Engineer',
        email: 'test@test.com',
        telefono: '123',
        linkedin: 'linkedin.com/in/test',
        resumen: 'Summary text',
    },
    experiencia: [{ id: 1, puesto: 'Dev', empresa: 'Corp', fechas: '2023', descripcion: 'Built stuff' }],
    educacion: [{ id: 2, titulo: 'BSc', institucion: 'Uni', fechas: '2020' }],
    habilidades: 'React, TS',
    extras: [{ id: 3, categoria: 'Languages', descripcion: 'English (C1)' }],
};

function renderWithMock(ui) {
    return render(
        <CvContext.Provider value={{ state: mockState, dispatch: () => {} }}>
            {ui}
        </CvContext.Provider>
    );
}

describe('Template1', () => {
    it('renders the full name', () => {
        renderWithMock(<Template1 />);
        // uppercase is applied via CSS class, the DOM text is the original value
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('renders experience entry', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText('Dev')).toBeInTheDocument();
        expect(screen.getByText('Corp')).toBeInTheDocument();
    });

    it('renders education entry', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText(/BSc/i)).toBeInTheDocument();
    });

    it('renders skills', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText('React, TS')).toBeInTheDocument();
    });

    it('has the id required for PDF export', () => {
        renderWithMock(<Template1 />);
        expect(document.getElementById('cv-preview-template')).not.toBeNull();
    });
});
