// src/layout/AppLayout.jsx

import React from 'react';
import Editor from '../editor/Editor';
import Preview from '../preview/Preview';

function AppLayout() {
    return (
        // Contenedor principal: ocupa toda la pantalla con un fondo gris claro
        <div className="bg-gray-100 min-h-screen">

            {/* Grid para el layout de dos columnas */}
            {/* En pantallas grandes (lg), usa un grid de dos columnas */}
            {/* En pantallas pequeñas, apila las columnas (Editor arriba, Preview abajo) */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 p-4 lg:p-8 max-w-7xl mx-auto">

                {/* Columna Izquierda: Editor (Ocupa todo el ancho en móviles) */}
                <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
                    <Editor />
                </div>

                {/* Columna Derecha: Vista Previa (Oculta en móviles para ahorrar espacio si es necesario) */}
                <div className="mt-8 lg:mt-0">
                    <Preview />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;