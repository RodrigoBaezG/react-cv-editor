// src/editor/forms/ExperienceForm.jsx

import React, { useState } from 'react';
import InputField from '../../components/InputField';
import TextareaField from '../../components/TextareaField';
import Button from '../../components/Button';
import { useCv } from '../../context/useCv';
import ExperienceItem from './ExperienceItem';
import { FaPlus } from 'react-icons/fa';

const initialNewItem = { puesto: '', empresa: '', fechas: '', descripcion: '' };

function ExperienceForm() {
    const { state, dispatch } = useCv();
    const [newItem, setNewItem] = useState(initialNewItem);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.puesto || !newItem.empresa) return;

        dispatch({ type: 'ADD_ITEM', payload: { section: 'experiencia', data: newItem } });
        setNewItem(initialNewItem);
    };

    return (
        <section className="px-6 py-5 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Work Experience
            </h3>

            <div className="space-y-2">
                {state.experiencia.map((item) => (
                    <ExperienceItem key={item.id} item={item} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 space-y-3">
                <p className="text-xs font-medium text-slate-500">Add Experience</p>

                <div className="grid grid-cols-2 gap-3">
                    <InputField label="Position" name="puesto" value={newItem.puesto} onChange={handleChange} />
                    <InputField label="Company" name="empresa" value={newItem.empresa} onChange={handleChange} />
                </div>
                <InputField label="Dates (e.g: 2020 – 2023)" name="fechas" value={newItem.fechas} onChange={handleChange} />
                <TextareaField label="Description" name="descripcion" value={newItem.descripcion} onChange={handleChange} rows={2} />

                <div className="flex justify-end">
                    <Button type="submit" variant="primary">
                        <FaPlus className="inline mr-1.5 text-[10px]" /> Add
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default ExperienceForm;
