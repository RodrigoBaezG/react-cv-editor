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
        <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700 pl-3 border-l-4 border-l-blue-500">
                Languages & Other
            </h3>

            <div className="space-y-3">
                {state.extras.map((item) => (
                    <ExtrasItem key={item.id} item={item} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h4 className="text-md font-semibold mb-3 text-gray-600">Add New Entry</h4>

                <InputField
                    label="Category (e.g: Languages, Certifications, Courses)"
                    name="categoria"
                    value={newItem.categoria}
                    onChange={handleChange}
                />
                <InputField
                    label="Description"
                    name="descripcion"
                    value={newItem.descripcion}
                    onChange={handleChange}
                    placeholder="e.g: English (C1), French (B2)"
                />

                <div className="flex justify-end mt-4">
                    <Button type="submit" variant="primary">
                        <FaPlus className="inline mr-1" /> Add Entry
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ExtrasForm;
