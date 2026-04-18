// src/editor/forms/ExtrasForm.jsx

import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCv } from '../../context/useCv';
import ExtrasItem from './ExtrasItem';
import { FaPlus } from 'react-icons/fa';

const initialNewItem = { categoria: '', descripcion: '' };

function ExtrasForm() {
    const { state, dispatch } = useCv();
    const [newItem, setNewItem] = useState(initialNewItem);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.categoria || !newItem.descripcion) return;

        dispatch({ type: 'ADD_ITEM', payload: { section: 'extras', data: newItem } });
        setNewItem(initialNewItem);
    };

    return (
        <section className="px-6 py-5 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Additional
            </h3>

            <div className="space-y-2">
                {state.extras.map((item) => (
                    <ExtrasItem key={item.id} item={item} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 space-y-3">
                <p className="text-xs font-medium text-slate-500">Add Entry</p>

                <InputField
                    label="Category (e.g: Languages, Certifications)"
                    name="categoria"
                    value={newItem.categoria}
                    onChange={handleChange}
                />
                <InputField
                    label="Description"
                    name="descripcion"
                    value={newItem.descripcion}
                    onChange={handleChange}
                />

                <div className="flex justify-end">
                    <Button type="submit" variant="primary">
                        <FaPlus className="inline mr-1.5 text-[10px]" /> Add
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default ExtrasForm;
