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
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700 pl-3 border-l-4 border-l-blue-500">
                Skills
            </h3>

            <TextareaField
                label="List your skills separated by commas (e.g: React, Node.js, Python, Git)"
                name="habilidades"
                value={state.habilidades}
                onChange={handleChange}
                rows={3}
            />
        </div>
    );
}

export default SkillsForm;
