// src/preview/Preview.jsx

import React from 'react';
import Template1 from './templates/Template1';

function Preview() {
    return (
        <div className="bg-gray-200 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📄 Preview
            </h2>
            <Template1 />
        </div>
    );
}

export default Preview;