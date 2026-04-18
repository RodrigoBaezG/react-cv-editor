// src/components/Button.jsx

import React from 'react';
import clsx from 'clsx';

function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {

    const baseStyle = "px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyle = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500',
    }[variant] ?? 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500';

    return (
        <button
            type={type}
            onClick={onClick}
            className={clsx(baseStyle, variantStyle, className)}
        >
            {children}
        </button>
    );
}

export default Button;
