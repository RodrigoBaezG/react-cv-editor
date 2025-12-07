// src/components/Button.jsx

import React from 'react';

/**
 * Componente Button reutilizable con variantes de estilo (primary, danger, secondary).
 * @param {string} props.variant - Define el estilo ('primary', 'danger', 'secondary').
 */
function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {

    // Definición de estilos base
    const baseStyle = "px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

    let variantStyle = '';

    switch (variant) {
        case 'primary':
            // Botón principal (para añadir o acciones positivas)
            variantStyle = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
            break;
        case 'danger':
            // Botón de peligro (para eliminar)
            variantStyle = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
            break;
        case 'secondary':
        default:
            // Botón secundario (para cerrar o cancelar)
            variantStyle = 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500';
            break;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variantStyle} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;