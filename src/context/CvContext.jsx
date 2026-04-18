// src/context/CvContext.jsx

import React, { createContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'mi-cv-editor-state';

export const initialState = {
    personal: {
        nombre: 'Your Name',
        titulo: 'Job Title (e.g: Frontend Developer)',
        email: 'email@example.com',
        telefono: '+34 123 456 789',
        linkedin: 'linkedin.com/in/tuperfil',
        resumen: 'I am an enthusiastic software developer passionate about React and building functional and attractive user interfaces. I am looking for my first professional role.',
    },
    experiencia: [
        {
            id: 1,
            puesto: 'Portfolio Project: CV Editor',
            empresa: 'Personal',
            fechas: '2025',
            descripcion: 'Design and implementation of a full-stack application with React and useReducer. Demonstration of complex state management and PDF export.',
        },
    ],
    educacion: [
        {
            id: 2,
            institucion: 'Technical University',
            titulo: 'Bachelor of Computer Science',
            fechas: '2021 - 2025',
        },
    ],
    habilidades: 'React, JavaScript (ES6+), HTML, CSS/Tailwind, Git, APIs REST',
};

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initialState;
    } catch {
        return initialState;
    }
}

export const cvReducer = (state, action) => {
    switch (action.type) {

        case 'UPDATE_PERSONAL_FIELD':
            return {
                ...state,
                personal: {
                    ...state.personal,
                    [action.payload.key]: action.payload.value,
                },
            };

        case 'UPDATE_SKILLS':
            return { ...state, habilidades: action.payload };

        case 'ADD_ITEM': {
            const newItem = {
                ...action.payload.data,
                id: Date.now(),
            };
            return {
                ...state,
                [action.payload.section]: [...state[action.payload.section], newItem],
            };
        }

        case 'EDIT_ITEM':
            return {
                ...state,
                [action.payload.section]: state[action.payload.section].map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload.data } : item
                ),
            };

        case 'DELETE_ITEM':
            return {
                ...state,
                [action.payload.section]: state[action.payload.section].filter(
                    item => item.id !== action.payload.id
                ),
            };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
};

export const CvContext = createContext(null);

export const CvProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cvReducer, undefined, loadState);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // storage quota exceeded — fail silently
        }
    }, [state]);

    return (
        <CvContext.Provider value={{ state, dispatch }}>
            {children}
        </CvContext.Provider>
    );
};
