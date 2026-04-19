// src/layout/AppLayout.jsx

import React, { useState, useEffect, useRef } from 'react';
import Editor from '../editor/Editor';
import Preview from '../preview/Preview';
import { FaCheck } from 'react-icons/fa';
import { useCv } from '../context/useCv';
import html2pdf from 'html2pdf.js';

function AppLayout() {
    const { state, dispatch } = useCv();
    const [activeTab, setActiveTab] = useState('edit');
    const [saved, setSaved] = useState(false);
    const [exporting, setExporting] = useState(false);
    const previewPanelRef = useRef(null);

    useEffect(() => {
        setSaved(true);
        const timer = setTimeout(() => setSaved(false), 2000);
        return () => clearTimeout(timer);
    }, [state]);

    const handleExportPdf = async () => {
        const element = document.getElementById('cv-preview-template');
        if (!element) return;

        setExporting(true);

        // On mobile the preview panel may be display:none (hidden class).
        // html2canvas cannot capture elements inside a display:none container,
        // so we temporarily override its display style during export.
        const panel = previewPanelRef.current;
        const panelWasHidden = panel && getComputedStyle(panel).display === 'none';
        if (panelWasHidden) {
            panel.style.display = 'block';
        }

        try {
            const options = {
                margin: 10,
                filename: 'curriculum_vitae.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    dpi: 192,
                    letterRendering: true,
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };
            await html2pdf().set(options).from(element).save();
        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            if (panelWasHidden) {
                panel.style.removeProperty('display');
            }
            setExporting(false);
        }
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        localStorage.removeItem('mi-cv-editor-state');
    };

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* Top bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900 tracking-tight text-sm">CV Editor</span>
                        <span className={`text-xs text-emerald-600 flex items-center gap-1 transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}>
                            <FaCheck className="text-[10px]" /> Saved
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleExportPdf}
                            disabled={exporting}
                            className="text-xs font-medium bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                        >
                            {exporting ? 'Generating…' : 'Export PDF'}
                        </button>
                    </div>
                </div>

                {/* Mobile tab switcher */}
                <div className="lg:hidden flex border-t border-slate-100">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                            activeTab === 'edit'
                                ? 'text-slate-900 border-b-2 border-slate-900'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                            activeTab === 'preview'
                                ? 'text-slate-900 border-b-2 border-slate-900'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Preview
                    </button>
                </div>
            </header>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8 p-4 lg:p-8 max-w-7xl mx-auto">

                <div className={`lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto ${activeTab !== 'edit' ? 'hidden lg:block' : ''}`}>
                    <Editor />
                </div>

                <div
                    ref={previewPanelRef}
                    className={`mt-4 lg:mt-0 ${activeTab !== 'preview' ? 'hidden lg:block' : ''}`}
                >
                    <Preview />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
