// src/preview/templates/Template1.jsx
//
// Colors use explicit hex values (Tailwind arbitrary syntax) instead of
// semantic tokens (slate-900, etc.) because html2canvas 1.4.x cannot parse
// the oklch() values that Tailwind v4 generates for named palette colors.

import React from 'react';
import { useCv } from '../../context/useCv';

function SectionHeading({ children }) {
    return (
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94a3b8] mb-3 pb-1.5 border-b border-[#e2e8f0]">
            {children}
        </h3>
    );
}

function Template1() {
    const { state } = useCv();
    const { personal, experiencia, educacion, habilidades, extras } = state;

    return (
        <div
            id="cv-preview-template"
            className="bg-white min-h-[842px] max-w-[595px] mx-auto text-[13px] leading-relaxed text-[#334155]"
            style={{ padding: '48px' }}
        >
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none">
                    {personal.nombre}
                </h1>
                <p className="text-sm text-[#64748b] mt-1">{personal.titulo}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[#94a3b8] mt-2.5">
                    <span>{personal.email}</span>
                    <span>{personal.telefono}</span>
                    <span>{personal.linkedin}</span>
                </div>
            </header>

            <hr className="border-[#e2e8f0] mb-5" />

            {/* Summary */}
            {personal.resumen && (
                <section className="mb-5">
                    <p className="text-[#475569] leading-relaxed">{personal.resumen}</p>
                </section>
            )}

            {/* Experience */}
            {experiencia.length > 0 && (
                <section className="mb-5">
                    <SectionHeading>Experience</SectionHeading>
                    {experiencia.map((item) => (
                        <div key={item.id} className="mb-4">
                            <div className="flex items-baseline justify-between gap-4">
                                <span className="font-semibold text-[#0f172a] text-[13px]">
                                    {item.puesto}
                                </span>
                                <span className="text-xs text-[#94a3b8] shrink-0">{item.fechas}</span>
                            </div>
                            <p className="text-xs text-[#64748b] mb-0.5">{item.empresa}</p>
                            {item.descripcion && (
                                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                                    {item.descripcion}
                                </p>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {educacion.length > 0 && (
                <section className="mb-5">
                    <SectionHeading>Education</SectionHeading>
                    {educacion.map((edu) => (
                        <div key={edu.id} className="flex items-baseline justify-between gap-4 mb-2">
                            <div>
                                <span className="font-semibold text-[#0f172a]">{edu.titulo}</span>
                                <span className="text-xs text-[#64748b] ml-2">{edu.institucion}</span>
                            </div>
                            <span className="text-xs text-[#94a3b8] shrink-0">{edu.fechas}</span>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {habilidades && (
                <section className="mb-5">
                    <SectionHeading>Skills</SectionHeading>
                    <p className="text-[#475569]">{habilidades}</p>
                </section>
            )}

            {/* Additional */}
            {extras.length > 0 && (
                <section>
                    <SectionHeading>Additional</SectionHeading>
                    {extras.map((item) => (
                        <div key={item.id} className="mb-1.5">
                            <span className="font-medium text-[#1e293b]">{item.categoria}: </span>
                            <span className="text-[#475569]">{item.descripcion}</span>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Template1;
