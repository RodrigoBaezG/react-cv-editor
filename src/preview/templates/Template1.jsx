// src/preview/templates/Template1.jsx

import React, { useContext } from 'react';
import { CvContext } from '../../context/CvContext'; // Importar el Contexto

function Template1() {
    // 1. Acceder al estado global
    const { state } = useContext(CvContext);
    const { personal, experiencia } = state;

    return (
        // ID necesario para la exportación a PDF
        <div id="cv-preview-template" className="bg-white text-[#1D4ED8] p-8 shadow-2xl min-h-[842px] max-w-[595px] mx-auto text-sm">

            {/* 1. SECCIÓN PERSONAL */}
            <header className="border-b-4 border-[#1D4ED8] pb-2 mb-4">
                <h1 className="text-4xl font-black text-[#1D4ED8] uppercase">{personal.nombre}</h1>
                <h2 className="text-lg font-medium text-[#1D4ED8]">{personal.titulo}</h2>
                <div className="text-xs mt-1 space-x-3">
                    <span>📧 {personal.email}</span>
                    <span>📞 {personal.telefono}</span>
                    <span>🔗 {personal.linkedin}</span>
                </div>
            </header>

            {/* Resumen */}
            <section className="mb-4">
                <p className="text-[#1D4ED8] text-sm">{personal.resumen}</p>
            </section>

            {/* 2. SECCIÓN EXPERIENCIA (Mapeamos el array del estado) */}
            <section>
                <h3 className="text-lg font-bold text-[#1D4ED8] border-b border-[#1D4ED8] mb-2">EXPERIENCE</h3>
                {experiencia.map((item) => (
                    <div key={item.id} className="mb-3">
                        <div className="flex justify-between font-semibold">
                            <span>{item.puesto} at {item.empresa}</span>
                            <span>{item.fechas}</span>
                        </div>
                        <p className="text-xs mt-1 text-[#1D4ED8]">{item.descripcion}</p>
                    </div>
                ))}
            </section>

            {/* 3. Placeholder for Education and Skills */}
            <section className='mt-6'>
                <h3 className="text-lg font-bold text-[#1D4ED8] border-b border-[#1D4ED8] mb-2">EDUCATION</h3>
                {state.educacion.map(edu => (
                    <p key={edu.id} className='text-sm'>{edu.titulo} at {edu.institucion} ({edu.fechas})</p>
                ))}
            </section>

            <section className='mt-6'>
                <h3 className="text-lg font-bold text-[#1D4ED8] border-b border-[#1D4ED8] mb-2">SKILLS</h3>
                <p className='text-sm'>{state.habilidades}</p>
            </section>
        </div>
    );
}

export default Template1;