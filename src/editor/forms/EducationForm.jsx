// src/editor/forms/EducationForm.jsx

import React, { useContext, useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CvContext } from '../../context/CvContext';
import EducationItem from './EducationItem';
import { FaPlus } from 'react-icons/fa';

const initialNewItem = {
    titulo: '',
    institucion: '',
    fechas: '',
};

function EducationForm() {
    const { state, dispatch } = useContext(CvContext);
    const [newItem, setNewItem] = useState(initialNewItem);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.titulo || !newItem.institucion) return;

        dispatch({
            type: 'ADD_ITEM',
            payload: {
                section: 'educacion', // <-- Usamos la sección 'educacion'
                data: newItem,
            },
        });

        setNewItem(initialNewItem);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">
                Formación Académica
            </h3>

            {/* 1. Lista de Elementos Actuales */}
            <div className="space-y-3">
                {state.educacion.map((item) => (
                    <EducationItem key={item.id} item={item} />
                ))}
            </div>

            {/* 2. Formulario para Añadir Nuevo Elemento */}
            <form onSubmit={handleSubmit} className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h4 className="text-md font-semibold mb-3 text-gray-600">Añadir Nueva Formación</h4>

                <InputField label="Título" name="titulo" value={newItem.titulo} onChange={handleChange} />
                <InputField label="Institución" name="institucion" value={newItem.institucion} onChange={handleChange} />
                <InputField label="Fechas" name="fechas" value={newItem.fechas} onChange={handleChange} />

                <div className="flex justify-end mt-4">
                    <Button type="submit" variant="primary">
                        <FaPlus className="inline mr-1" /> Añadir Formación
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default EducationForm;