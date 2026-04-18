// src/preview/templates/Template1.jsx

import React from 'react';
import { useCv } from '../../context/useCv';

function Template1() {
    const { state } = useCv();
    const { personal, experiencia, educacion, habilidades, extras } = state;

    return (
        <div id="cv-preview-template" className="bg-white p-8 shadow-2xl min-h-[842px] max-w-[595px] mx-auto text-sm text-[#1F2937]">

            {/* Header band */}
            <header className="bg-[#1D4ED8] text-white px-8 py-6 -mx-8 -mt-8 mb-6">
                <h1 className="text-4xl font-black uppercase tracking-wide">{personal.nombre}</h1>
                <h2 className="text-base font-medium opacity-90 mt-1">{personal.titulo}</h2>
                <div className="flex gap-4 text-xs mt-3 opacity-80 flex-wrap">
                    <span>✉ {personal.email}</span>
                    <span>✆ {personal.telefono}</span>
                    <span>🔗 {personal.linkedin}</span>
                </div>
            </header>

            {/* Summary */}
            <section className="mb-5">
                <p className="text-[#374151] leading-relaxed">{personal.resumen}</p>
            </section>

            {/* Experience */}
            <section className="mb-5">
                <h3 className="text-base font-bold text-[#1D4ED8] border-b-2 border-[#1D4ED8] mb-3 pb-1 uppercase tracking-wide">
                    Experience
                </h3>
                {experiencia.map((item) => (
                    <div key={item.id} className="mb-4">
                        <div className="flex justify-between">
                            <span className="font-semibold text-[#1F2937]">{item.puesto} at {item.empresa}</span>
                            <span className="text-[#6B7280] text-xs">{item.fechas}</span>
                        </div>
                        <p className="text-xs mt-1 text-[#374151] leading-relaxed">{item.descripcion}</p>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="mb-5">
                <h3 className="text-base font-bold text-[#1D4ED8] border-b-2 border-[#1D4ED8] mb-3 pb-1 uppercase tracking-wide">
                    Education
                </h3>
                {educacion.map((edu) => (
                    <div key={edu.id} className="mb-2">
                        <span className="font-semibold text-[#1F2937]">{edu.titulo}</span>
                        <span className="text-[#6B7280] text-xs ml-2">{edu.institucion} · {edu.fechas}</span>
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section className="mb-5">
                <h3 className="text-base font-bold text-[#1D4ED8] border-b-2 border-[#1D4ED8] mb-3 pb-1 uppercase tracking-wide">
                    Skills
                </h3>
                <p className="text-[#374151]">{habilidades}</p>
            </section>

            {/* Extras */}
            {extras.length > 0 && (
                <section>
                    <h3 className="text-base font-bold text-[#1D4ED8] border-b-2 border-[#1D4ED8] mb-3 pb-1 uppercase tracking-wide">
                        Languages & Other
                    </h3>
                    {extras.map((item) => (
                        <div key={item.id} className="mb-2">
                            <span className="font-semibold text-[#1F2937]">{item.categoria}: </span>
                            <span className="text-[#374151]">{item.descripcion}</span>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Template1;
