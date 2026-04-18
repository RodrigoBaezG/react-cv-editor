// src/editor/Editor.jsx

import React, { useState, useEffect } from 'react';
import PersonalForm from './forms/PersonalForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import ExtrasForm from './forms/ExtrasForm';
import Button from '../components/Button';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaPencilAlt, FaCheck, FaUndo } from 'react-icons/fa';
import { useCv } from '../context/useCv';

function Editor() {
    const { state, dispatch } = useCv();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(true);
        const timer = setTimeout(() => setSaved(false), 2000);
        return () => clearTimeout(timer);
    }, [state]);

    const handleExportPdf = () => {
        const element = document.getElementById('cv-preview-template');
        if (!element) return;
        const options = {
            margin: 10,
            filename: 'curriculum_vitae.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().set(options).from(element).save();
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        localStorage.removeItem('mi-cv-editor-state');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl space-y-8">

            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                        <FaPencilAlt className="text-blue-600" />
                        CV Editor
                    </h2>
                    {saved && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <FaCheck /> Saved
                        </span>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleReset} variant="secondary" className="text-xs">
                        <FaUndo className="inline mr-1" /> Reset
                    </Button>
                    <Button onClick={handleExportPdf} variant="primary" className="shadow-lg">
                        <FaDownload className="inline mr-2" />
                        Export to PDF
                    </Button>
                </div>
            </div>

            <PersonalForm />
            <ExperienceForm />
            <EducationForm />
            <SkillsForm />
            <ExtrasForm />
        </div>
    );
}

export default Editor;
