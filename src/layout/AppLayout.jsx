// src/layout/AppLayout.jsx

import React, { useState } from 'react';
import Editor from '../editor/Editor';
import Preview from '../preview/Preview';
import { FaPencilAlt, FaFileAlt } from 'react-icons/fa';

function AppLayout() {
    const [activeTab, setActiveTab] = useState('edit');

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* Mobile tab switcher */}
            <div className="lg:hidden flex border-b bg-white sticky top-0 z-10 shadow-sm">
                <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'edit'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaPencilAlt className="text-xs" /> Edit
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'preview'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaFileAlt className="text-xs" /> Preview
                </button>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8 p-4 lg:p-8 max-w-7xl mx-auto">

                <div className={`lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto ${activeTab !== 'edit' ? 'hidden lg:block' : ''}`}>
                    <Editor />
                </div>

                <div className={`mt-8 lg:mt-0 ${activeTab !== 'preview' ? 'hidden lg:block' : ''}`}>
                    <Preview />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
