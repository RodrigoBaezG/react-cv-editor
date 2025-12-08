// src/editor/forms/ExperienceItem.jsx

import React, { useContext, useState } from 'react';
import InputField from '../../components/InputField';
import TextareaField from '../../components/TextareaField';
import Button from '../../components/Button';
import { CvContext } from '../../context/CvContext';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function ExperienceItem({ item }) {
    const { dispatch } = useContext(CvContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(item); // Estado local para la edición

    // Maneja el cambio de los inputs locales
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Envía la acción de edición al contexto
    const handleSave = () => {
        dispatch({
            type: 'EDIT_ITEM',
            payload: {
                section: 'experiencia',
                id: item.id,
                data: formData, // Envía los datos actualizados
            },
        });
        setIsEditing(false); // Sale del modo de edición
    };

    // Envía la acción de eliminación al contexto
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            dispatch({
                type: 'DELETE_ITEM',
                payload: {
                    section: 'experiencia',
                    id: item.id,
                },
            });
        }
    };

    if (isEditing) {
        // Modo de Edición: Muestra los campos de entrada
        return (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-4 shadow-md">
                <h4 className="text-md font-semibold mb-2">Editing Experience</h4>
                <InputField label="Position" name="puesto" value={formData.puesto} onChange={handleChange} />
                <InputField label="Company" name="empresa" value={formData.empresa} onChange={handleChange} />
                <InputField label="Dates (Ej: 2020 - 2023)" name="fechas" value={formData.fechas} onChange={handleChange} />
                <TextareaField label="Description of Responsibilities" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />
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

    // Modo de Vista (Normal): Muestra la información y botones de acción
    return (
        <div className="p-3 border border-gray-200 rounded-lg mb-2 flex justify-between items-center bg-white shadow-sm hover:bg-gray-50 transition">
            <div>
                <h4 className="font-semibold text-gray-800">{item.puesto} at {item.empresa}</h4>
                <p className="text-xs text-gray-500">{item.fechas}</p>
            </div>
            <div className="space-x-2 flex">
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="p-2">
                    <FaEdit />
                </Button>
                <Button variant="danger" onClick={handleDelete} className="p-2">
                    <FaTrash />
                </Button>
            </div>
        </div>
    );
}

export default ExperienceItem;