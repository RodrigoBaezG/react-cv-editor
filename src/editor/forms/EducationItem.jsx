// src/editor/forms/EducationItem.jsx

import React, { useContext, useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CvContext } from '../../context/CvContext';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function EducationItem({ item }) {
    const { dispatch } = useContext(CvContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        dispatch({
            type: 'EDIT_ITEM',
            payload: {
                section: 'educacion', // <-- Cambiado a 'educacion'
                id: item.id,
                data: formData,
            },
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada de educación?')) {
            dispatch({
                type: 'DELETE_ITEM',
                payload: {
                    section: 'educacion', // <-- Cambiado a 'educacion'
                    id: item.id,
                },
            });
        }
    };

    if (isEditing) {
        return (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-4 shadow-md">
                <h4 className="text-md font-semibold mb-2">Editando Educación</h4>
                <InputField label="Título (Ej: Grado en Ingeniería)" name="titulo" value={formData.titulo} onChange={handleChange} />
                <InputField label="Institución / Universidad" name="institucion" value={formData.institucion} onChange={handleChange} />
                <InputField label="Fechas de Inicio y Fin" name="fechas" value={formData.fechas} onChange={handleChange} />
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}><FaTimes className="inline mr-1" /> Cancelar</Button>
                    <Button variant="primary" onClick={handleSave}><FaSave className="inline mr-1" /> Guardar</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 border border-gray-200 rounded-lg mb-2 flex justify-between items-center bg-white shadow-sm hover:bg-gray-50 transition">
            <div>
                <h4 className="font-semibold text-gray-800">{item.titulo}</h4>
                <p className="text-xs text-gray-500">{item.institucion} ({item.fechas})</p>
            </div>
            <div className="space-x-2 flex">
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="p-2"><FaEdit /></Button>
                <Button variant="danger" onClick={handleDelete} className="p-2"><FaTrash /></Button>
            </div>
        </div>
    );
}

export default EducationItem;