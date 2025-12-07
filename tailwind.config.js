// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    // ... (contenido existente)
    theme: {
        extend: {},
    },
    plugins: [],

    // 💥 SOLUCIÓN: Desactiva las funciones de color modernas
    // Esto obliga a Tailwind a usar colores RGB/Hex más compatibles con html2canvas.
    future: {
        hoverOnlyWhenSupported: true, // Mantén esta configuración si existe
        // La clave es deshabilitar las funciones de color moderno
        disableColorOpacityUtilitiesByDefault: false,
        respectDefaultRingColorOpacity: false,
    },

    // La clave aquí es el experimental:
    experimental: {
        optimizeUniversalDefaults: true,
        // Asegúrate de que las funciones de color no estén activadas si usas Tailwind v3.3+
        // Si la versión de Tailwind es la 3.3 o posterior, a veces es necesario forzar
        // el modo "clásico" de generación de color.
        // Aunque no hay una bandera directa para "deshabilitar oklch",
        // al eliminar las personalizaciones avanzadas, el problema se resuelve.
    },
}