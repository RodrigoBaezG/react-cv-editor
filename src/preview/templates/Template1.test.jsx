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

    it('renders additional section', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText(/Additional/i)).toBeInTheDocument();
        expect(screen.getByText(/Languages/i)).toBeInTheDocument();
        expect(screen.getByText(/English \(C1\)/i)).toBeInTheDocument();
    });

    it('hides additional section when extras is empty', () => {
        const stateWithoutExtras = { ...mockState, extras: [] };
        render(
            <CvContext.Provider value={{ state: stateWithoutExtras, dispatch: () => {} }}>
                <Template1 />
            </CvContext.Provider>
        );
        expect(screen.queryByText('Additional')).not.toBeInTheDocument();
    });

    // PDF export requirements
    it('has the id required for PDF export', () => {
        renderWithMock(<Template1 />);
        expect(document.getElementById('cv-preview-template')).not.toBeNull();
    });

    it('export target uses explicit hex colors (no oklch)', () => {
        renderWithMock(<Template1 />);
        const el = document.getElementById('cv-preview-template');
        // Collect all class names used inside the export target
        const allClasses = Array.from(el.querySelectorAll('*'))
            .flatMap(node => Array.from(node.classList));
        // Tailwind semantic color tokens like "text-slate-900" generate oklch in v4.
        // The template must use explicit hex arbitrary values instead.
        const semanticColorPattern = /^(text|bg|border|ring)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+$/;
        const offenders = allClasses.filter(c => semanticColorPattern.test(c));
        expect(offenders).toEqual([]);
    });

    it('export target background is white', () => {
        renderWithMock(<Template1 />);
        const el = document.getElementById('cv-preview-template');
        expect(el.classList.contains('bg-white')).toBe(true);
    });
});
