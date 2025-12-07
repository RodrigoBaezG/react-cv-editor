// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // Usa 'react-dom/client' para React 18+
import App from './App.jsx';
import './index.css';
import { CvProvider } from './context/CvContext.jsx'; // <-- Importación crucial

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CvProvider> {/* <-- Envolvemos toda la App */}
      <App />
    </CvProvider>
  </React.StrictMode>,
);