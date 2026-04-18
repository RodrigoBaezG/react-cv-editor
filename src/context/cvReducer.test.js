import { describe, it, expect } from 'vitest';
import { cvReducer, initialState } from './CvContext';

describe('cvReducer', () => {
    it('UPDATE_PERSONAL_FIELD updates a personal field', () => {
        const action = {
            type: 'UPDATE_PERSONAL_FIELD',
            payload: { key: 'nombre', value: 'John Doe' },
        };
        const next = cvReducer(initialState, action);
        expect(next.personal.nombre).toBe('John Doe');
        expect(next.personal.email).toBe(initialState.personal.email);
    });

    it('ADD_ITEM adds to the correct section', () => {
        const action = {
            type: 'ADD_ITEM',
            payload: { section: 'experiencia', data: { puesto: 'Dev', empresa: 'ACME', fechas: '2024', descripcion: '' } },
        };
        const next = cvReducer(initialState, action);
        expect(next.experiencia).toHaveLength(initialState.experiencia.length + 1);
        expect(next.experiencia.at(-1).puesto).toBe('Dev');
        expect(next.experiencia.at(-1).id).toBeDefined();
    });

    it('EDIT_ITEM updates only the matching item', () => {
        const targetId = initialState.experiencia[0].id;
        const action = {
            type: 'EDIT_ITEM',
            payload: { section: 'experiencia', id: targetId, data: { puesto: 'Updated' } },
        };
        const next = cvReducer(initialState, action);
        expect(next.experiencia[0].puesto).toBe('Updated');
    });

    it('DELETE_ITEM removes the item by id', () => {
        const targetId = initialState.experiencia[0].id;
        const action = {
            type: 'DELETE_ITEM',
            payload: { section: 'experiencia', id: targetId },
        };
        const next = cvReducer(initialState, action);
        expect(next.experiencia).toHaveLength(initialState.experiencia.length - 1);
        expect(next.experiencia.find(i => i.id === targetId)).toBeUndefined();
    });

    it('UPDATE_SKILLS updates root habilidades', () => {
        const action = { type: 'UPDATE_SKILLS', payload: 'React, TypeScript' };
        const next = cvReducer(initialState, action);
        expect(next.habilidades).toBe('React, TypeScript');
        expect(next.personal.habilidades).toBeUndefined();
    });

    it('RESET returns initialState', () => {
        const modified = cvReducer(initialState, {
            type: 'UPDATE_PERSONAL_FIELD',
            payload: { key: 'nombre', value: 'Changed' },
        });
        const reset = cvReducer(modified, { type: 'RESET' });
        expect(reset).toEqual(initialState);
    });

    it('unknown action returns state unchanged', () => {
        const next = cvReducer(initialState, { type: 'UNKNOWN' });
        expect(next).toBe(initialState);
    });
});
