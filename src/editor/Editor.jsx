// src/editor/Editor.jsx

import React from 'react';
import PersonalForm from './forms/PersonalForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import ExtrasForm from './forms/ExtrasForm';

function Editor() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            <PersonalForm />
            <ExperienceForm />
            <EducationForm />
            <SkillsForm />
            <ExtrasForm />
        </div>
    );
}

export default Editor;
