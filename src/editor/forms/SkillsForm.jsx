// src/editor/forms/SkillsForm.jsx

import React, { useContext } from 'react';
import TextareaField from '../../components/TextareaField';
import { CvContext } from '../../context/CvContext';

function SkillsForm() {
    const { state, dispatch } = useContext(CvContext);

    const handleChange = (e) => {
        dispatch({
            type: 'UPDATE_PERSONAL_FIELD',
            payload: {
                key: 'habilidades',
                value: e.target.value,
            },
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">
                Skills
            </h3>

            <TextareaField
                label="List your skills separated by commas (Ej: React, Node.js, Python, Git)"
                name="habilidades"
                value={state.habilidades}
                onChange={handleChange}
                rows={3}
            />
        </div>
    );
}

export default SkillsForm;