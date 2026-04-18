// src/editor/forms/ExtrasItem.jsx

import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCv } from '../../context/useCv';
import { FaTrash, FaEdit, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

function ExtrasItem({ item }) {
    const { dispatch } = useCv();
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [formData, setFormData] = useState(item);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        dispatch({
            type: 'EDIT_ITEM',
            payload: { section: 'extras', id: item.id, data: formData },
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        dispatch({
            type: 'DELETE_ITEM',
            payload: { section: 'extras', id: item.id },
        });
    };

    if (isEditing) {
        return (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-4 shadow-md">
                <h4 className="text-md font-semibold mb-2">Editing Entry</h4>
                <InputField label="Category (e.g: Languages, Certifications)" name="categoria" value={formData.categoria} onChange={handleChange} />
                <InputField label="Description" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        <FaTimes className="inline mr-1" /> Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        <FaSave className="inline mr-1" /> Save
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 border border-gray-200 rounded-lg mb-2 bg-white shadow-sm hover:bg-gray-50 transition">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-semibold text-gray-800">{item.categoria}</h4>
                    <p className="text-xs text-gray-500">{item.descripcion}</p>
                </div>
                <div className="space-x-2 flex">
                    <Button variant="secondary" onClick={() => setIsEditing(true)} className="p-2">
                        <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => setConfirmDelete(true)} className="p-2">
                        <FaTrash />
                    </Button>
                </div>
            </div>

            {confirmDelete && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between gap-3">
                    <span className="text-sm text-red-700 flex items-center gap-2">
                        <FaExclamationTriangle className="shrink-0" />
                        Delete this entry?
                    </span>
                    <div className="flex gap-2 shrink-0">
                        <Button variant="secondary" onClick={() => setConfirmDelete(false)} className="py-1 px-2 text-xs">
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} className="py-1 px-2 text-xs">
                            Delete
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExtrasItem;
