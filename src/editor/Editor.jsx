// src/editor/Editor.jsx

import React from 'react';
import PersonalForm from './forms/PersonalForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm'; // <-- Nuevo
import SkillsForm from './forms/SkillsForm';     // <-- Nuevo
import Button from '../components/Button';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';

function Editor() {

    const handleExportPdf = () => {
        const element = document.getElementById('cv-preview-template');

        // ... (Tu lógica de exportación a PDF) ...
        if (!element) {
            alert('Error: No se encontró la plantilla de CV para exportar.');
            return;
        }
        const options = { margin: 10, filename: 'curriculum_vitae.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
        html2pdf().set(options).from(element).save();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl space-y-8">

            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-3xl font-bold text-blue-800">
                    ✏️ Editor de Currículum
                </h2>

                <Button onClick={handleExportPdf} variant="primary" className="shadow-lg">
                    <FaDownload className="inline mr-2" />
                    Exportar a PDF
                </Button>
            </div>

            {/* 1. SECCIÓN PERSONAL */}
            <PersonalForm />

            {/* 2. SECCIÓN EXPERIENCIA */}
            <ExperienceForm />

            {/* 💥 3. SECCIÓN EDUCACIÓN */}
            <EducationForm />

            {/* 💥 4. SECCIÓN HABILIDADES */}
            <SkillsForm />

            <div className='pt-4 border-t'>
                <p className='text-sm text-gray-500'>
                    ¡El proyecto está completo! Tu portafolio ahora tiene una herramienta funcional.
                </p>
            </div>

        </div>
    );
}

export default Editor;