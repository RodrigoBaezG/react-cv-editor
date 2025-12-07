// src/editor/forms/PersonalForm.jsx

import React, { useContext } from 'react';
import InputField from '../../components/InputField';
import TextareaField from '../../components/TextareaField';
import { CvContext } from '../../context/CvContext';

function PersonalForm() {
    // 1. Acceder al estado y a la función de dispatch
    const { state, dispatch } = useContext(CvContext);
    const { personal } = state;

    // 2. Manejar el cambio de input
    const handleChange = (e) => {
        // La acción es UPDATE_PERSONAL_FIELD definida en el reducer
        dispatch({
            type: 'UPDATE_PERSONAL_FIELD',
            payload: {
                key: e.target.name, // 'nombre', 'email', 'titulo', etc.
                value: e.target.value,
            },
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">
                Información Personal
            </h3>

            {/* Fila 1: Nombre y Título */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Nombre Completo"
                    name="nombre"
                    value={personal.nombre}
                    onChange={handleChange}
                />
                <InputField
                    label="Puesto Deseado/Título"
                    name="titulo"
                    value={personal.titulo}
                    onChange={handleChange}
                />
            </div>

            {/* Fila 2: Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={personal.email}
                    onChange={handleChange}
                />
                <InputField
                    label="Teléfono"
                    name="telefono"
                    type="tel"
                    value={personal.telefono}
                    onChange={handleChange}
                />
                <InputField
                    label="LinkedIn / Web"
                    name="linkedin"
                    value={personal.linkedin}
                    onChange={handleChange}
                />
            </div>

            {/* Fila 3: Resumen Profesional */}
            <TextareaField
                label="Resumen Profesional"
                name="resumen"
                value={personal.resumen}
                onChange={handleChange}
                rows={5}
            />
        </div>
    );
}

export default PersonalForm;