// src/preview/Preview.jsx

import React from 'react';
import Template1 from './templates/Template1';
import { FaFileAlt } from 'react-icons/fa';

function Preview() {
    return (
        <div className="bg-gray-200 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaFileAlt className="text-gray-500" />
                Preview
            </h2>
            <Template1 />
        </div>
    );
}

export default Preview;
