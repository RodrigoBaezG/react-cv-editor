// src/editor/forms/EducationForm.jsx

import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCv } from '../../context/useCv';
import EducationItem from './EducationItem';
import { FaPlus } from 'react-icons/fa';

const initialNewItem = { titulo: '', institucion: '', fechas: '' };

function EducationForm() {
    const { state, dispatch } = useCv();
    const [newItem, setNewItem] = useState(initialNewItem);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.titulo || !newItem.institucion) return;

        dispatch({ type: 'ADD_ITEM', payload: { section: 'educacion', data: newItem } });
        setNewItem(initialNewItem);
    };

    return (
        <section className="px-6 py-5 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Education
            </h3>

            <div className="space-y-2">
                {state.educacion.map((item) => (
                    <EducationItem key={item.id} item={item} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 space-y-3">
                <p className="text-xs font-medium text-slate-500">Add Education</p>

                <InputField label="Degree / Title" name="titulo" value={newItem.titulo} onChange={handleChange} />
                <InputField label="Institution" name="institucion" value={newItem.institucion} onChange={handleChange} />
                <InputField label="Dates" name="fechas" value={newItem.fechas} onChange={handleChange} />

                <div className="flex justify-end">
                    <Button type="submit" variant="primary">
                        <FaPlus className="inline mr-1.5 text-[10px]" /> Add
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default EducationForm;
