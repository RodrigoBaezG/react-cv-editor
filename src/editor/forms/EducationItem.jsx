// src/editor/forms/EducationItem.jsx

import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCv } from '../../context/useCv';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function EducationItem({ item }) {
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
            payload: { section: 'educacion', id: item.id, data: formData },
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        dispatch({
            type: 'DELETE_ITEM',
            payload: { section: 'educacion', id: item.id },
        });
    };

    if (isEditing) {
        return (
            <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg space-y-2">
                <InputField label="Degree / Title" name="titulo" value={formData.titulo} onChange={handleChange} />
                <InputField label="Institution" name="institucion" value={formData.institucion} onChange={handleChange} />
                <InputField label="Dates" name="fechas" value={formData.fechas} onChange={handleChange} />
                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        <FaTimes className="inline mr-1 text-[10px]" /> Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        <FaSave className="inline mr-1 text-[10px]" /> Save
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.titulo}</p>
                    <p className="text-xs text-slate-400">{item.institucion} · {item.fechas}</p>
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                    <button
                        onClick={() => { setIsEditing(true); setConfirmDelete(false); }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                        <FaEdit className="text-xs" />
                    </button>
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                        <FaTrash className="text-xs" />
                    </button>
                </div>
            </div>

            {confirmDelete && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">Remove this entry?</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors font-medium"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EducationItem;
