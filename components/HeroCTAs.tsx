'use client';

import React from 'react';
import { Box, Camera } from 'lucide-react';

interface HeroCTAsProps {
    sku: string;
}

export default function HeroCTAs({ sku }: HeroCTAsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            {/* Primary: Brand Green — EXPLORE IN 3D */}
            <button
                onClick={() => window.location.href = `/product/${sku}`}
                className="btn-primary px-10 py-4 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
                <Box className="w-4 h-4" /> 
                <span className="text-[11px] font-black tracking-[0.2em] uppercase">EXPLORE COLLECTION</span>
            </button>
            {/* Secondary: Red Accent — VIEW IN YOUR SPACE */}
            <button
                onClick={() => window.location.href = `/product/${sku}?ar=true`}
                className="btn-accent px-10 py-4 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
                <Camera className="w-4 h-4" /> 
                <span className="text-[11px] font-black tracking-[0.2em] uppercase">VIEW IN YOUR SPACE</span>
            </button>
        </div>
    );
}
