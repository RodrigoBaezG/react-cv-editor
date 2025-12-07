// src/components/TextareaField.jsx

import React from 'react';

function TextareaField({ label, name, value, onChange, rows = 4 }) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value || ''}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
        </div>
    );
}

export default TextareaField;