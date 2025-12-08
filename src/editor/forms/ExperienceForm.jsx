// src/editor/forms/ExperienceForm.jsx

import React, { useContext, useState } from 'react';
import InputField from '../../components/InputField';
import TextareaField from '../../components/TextareaField';
import Button from '../../components/Button';
import { CvContext } from '../../context/CvContext';
import ExperienceItem from './ExperienceItem';
import { FaPlus } from 'react-icons/fa';

// Estado inicial para un nuevo elemento
const initialNewItem = {
    puesto: '',
    empresa: '',
    fechas: '',
    descripcion: '',
};

function ExperienceForm() {
    const { state, dispatch } = useContext(CvContext);
    const [newItem, setNewItem] = useState(initialNewItem);

    // Maneja el cambio en el formulario de NUEVO elemento
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    // Maneja el envío para AÑADIR nuevo elemento
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.puesto || !newItem.empresa) return; // Validación simple

        dispatch({
            type: 'ADD_ITEM',
            payload: {
                section: 'experiencia',
                data: newItem,
            },
        });

        setNewItem(initialNewItem); // Limpiar el formulario después de añadir
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">
                Work Experience
            </h3>

            {/* 1. Lista de Experiencias Actuales (Recorre el estado) */}
            <div className="space-y-3">
                {state.experiencia.map((item) => (
                    <ExperienceItem key={item.id} item={item} />
                ))}
            </div>

            {/* 2. Formulario para Añadir Nueva Experiencia */}
            <form onSubmit={handleSubmit} className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h4 className="text-md font-semibold mb-3 text-gray-600">Add New Experience</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputField label="Position" name="puesto" value={newItem.puesto} onChange={handleChange} />
                    <InputField label="Company" name="empresa" value={newItem.empresa} onChange={handleChange} />
                </div>
                <InputField label="Dates (Ej: 2020 - 2023)" name="fechas" value={newItem.fechas} onChange={handleChange} />
                <TextareaField label="Description of Responsibilities" name="descripcion" value={newItem.descripcion} onChange={handleChange} rows={2} />

                <div className="flex justify-end mt-4">
                    <Button type="submit" variant="primary">
                        <FaPlus className="inline mr-1" /> Add Experience
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ExperienceForm;