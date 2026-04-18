// src/editor/forms/SkillsForm.jsx

import React from 'react';
import TextareaField from '../../components/TextareaField';
import { useCv } from '../../context/useCv';

function SkillsForm() {
    const { state, dispatch } = useCv();

    const handleChange = (e) => {
        dispatch({ type: 'UPDATE_SKILLS', payload: e.target.value });
    };

    return (
        <section className="px-6 py-5 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Skills
            </h3>

            <TextareaField
                label="List your skills separated by commas"
                name="habilidades"
                value={state.habilidades}
                onChange={handleChange}
                rows={3}
            />
        </section>
    );
}

export default SkillsForm;
