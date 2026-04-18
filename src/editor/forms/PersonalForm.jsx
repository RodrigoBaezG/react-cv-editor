// src/editor/forms/PersonalForm.jsx

import React from 'react';
import InputField from '../../components/InputField';
import TextareaField from '../../components/TextareaField';
import { useCv } from '../../context/useCv';

function PersonalForm() {
    const { state, dispatch } = useCv();
    const { personal } = state;

    const handleChange = (e) => {
        dispatch({
            type: 'UPDATE_PERSONAL_FIELD',
            payload: { key: e.target.name, value: e.target.value },
        });
    };

    return (
        <section className="px-6 py-5 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name" name="nombre" value={personal.nombre} onChange={handleChange} />
                <InputField label="Job Title" name="titulo" value={personal.titulo} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Email" name="email" type="email" value={personal.email} onChange={handleChange} />
                <InputField label="Phone" name="telefono" type="tel" value={personal.telefono} onChange={handleChange} />
                <InputField label="LinkedIn / Web" name="linkedin" value={personal.linkedin} onChange={handleChange} />
            </div>

            <TextareaField
                label="Professional Summary"
                name="resumen"
                value={personal.resumen}
                onChange={handleChange}
                rows={4}
            />
        </section>
    );
}

export default PersonalForm;
