// src/context/CvContext.jsx

import React, { createContext, useReducer } from 'react';

// 1. Estado Inicial (Initial State)
const initialState = {
    personal: {
        nombre: 'Tu Nombre',
        titulo: 'Puesto Deseado (Ej: Desarrollador Frontend)',
        email: 'email@ejemplo.com',
        telefono: '+34 123 456 789',
        linkedin: 'linkedin.com/in/tuperfil',
        resumen: 'Soy un desarrollador de software entusiasta con pasión por React y la construcción de interfaces de usuario funcionales y atractivas. Busco mi primer rol profesional.',
    },
    experiencia: [
        {
            id: 1,
            puesto: 'Proyecto de Portafolio: Editor de CV',
            empresa: 'Personal',
            fechas: '2025',
            descripcion: 'Diseño e implementación de una aplicación full-stack con React y useReducer. Demostración de gestión de estados complejos y exportación a PDF.',
        },
    ],
    educacion: [
        {
            id: 2,
            institucion: 'Universidad Tecnológica',
            titulo: 'Grado en Ingeniería Informática',
            fechas: '2021 - 2025',
        },
    ],
    habilidades: 'React, JavaScript (ES6+), HTML, CSS/Tailwind, Git, APIs REST',
};

// La función Reducer
const cvReducer = (state, action) => {
    switch (action.type) {

        // 1. Actualiza campos simples (personal, habilidades)
        case 'UPDATE_PERSONAL_FIELD':
            return {
                ...state,
                personal: {
                    ...state.personal,
                    [action.payload.key]: action.payload.value,
                },
            };

        // 2. Añade un nuevo elemento (Experiencia o Educación)
        case 'ADD_ITEM':
            const newItem = {
                ...action.payload.data,
                id: Date.now(), // Asigna un ID único
            };
            return {
                ...state,
                [action.payload.section]: [...state[action.payload.section], newItem],
            };

        // 3. Edita un elemento existente (Experiencia o Educación)
        case 'EDIT_ITEM':
            return {
                ...state,
                [action.payload.section]: state[action.payload.section].map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload.data } : item
                ),
            };

        // 4. Elimina un elemento (Experiencia o Educación)
        case 'DELETE_ITEM':
            return {
                ...state,
                [action.payload.section]: state[action.payload.section].filter(
                    item => item.id !== action.payload.id
                ),
            };

        default:
            return state;
    }
};

// 2. Definir el Contexto y el Proveedor

export const CvContext = createContext(initialState);

export const CvProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cvReducer, initialState);

    return (
        <CvContext.Provider value={{ state, dispatch }}>
            {children}
        </CvContext.Provider>
    );
};