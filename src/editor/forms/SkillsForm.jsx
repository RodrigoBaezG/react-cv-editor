// src/editor/forms/SkillsForm.jsx

import React, { useContext } from 'react';
import TextareaField from '../../components/TextareaField';
import { CvContext } from '../../context/CvContext';

function SkillsForm() {
    const { state, dispatch } = useContext(CvContext);

    const handleChange = (e) => {
        // Reutilizamos la acción UPDATE_PERSONAL_FIELD,
        // ya que 'habilidades' es una clave de nivel superior como 'personal'
        dispatch({
            type: 'UPDATE_PERSONAL_FIELD',
            payload: {
                key: 'habilidades', // Clave en el estado
                value: e.target.value,
            },
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">
                Habilidades Técnicas
            </h3>

            <TextareaField
                label="Enumera tus habilidades separadas por comas (Ej: React, Node.js, Python, Git)"
                name="habilidades"
                value={state.habilidades}
                onChange={handleChange}
                rows={3}
            />
        </div>
    );
}

export default SkillsForm;