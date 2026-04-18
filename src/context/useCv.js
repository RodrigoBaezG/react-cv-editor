// src/context/useCv.js

import { useContext } from 'react';
import { CvContext } from './CvContext';

export function useCv() {
    const ctx = useContext(CvContext);
    if (!ctx) throw new Error('useCv must be used within CvProvider');
    return ctx;
}
