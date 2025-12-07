// src/components/InputField.jsx

import React from 'react';

/**
 * Componente reutilizable para un campo de entrada de formulario.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.label - Etiqueta visible del campo.
 * @param {string} props.name - Nombre (clave) del campo en el objeto de estado.
 * @param {string} [props.type='text'] - Tipo de input (text, email, tel, etc.).
 * @param {string} props.value - Valor actual del campo.
 * @param {function} props.onChange - Función que se ejecuta al cambiar el valor.
 */
function InputField({ label, name, type = 'text', value, onChange }) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value || ''} // Usar '' si el valor es null/undefined para inputs controlados
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    );
}

export default InputField;