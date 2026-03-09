'use client';

import React from 'react';
import { Box, Camera } from 'lucide-react';

interface HeroCTAsProps {
    sku: string;
}

export default function HeroCTAs({ sku }: HeroCTAsProps) {
    return (
        <div className="flex flex-row items-center gap-3 w-full">
            {/* Primary: Gold — EXPLORE IN 3D */}
            <button
                onClick={() => window.location.href = `/product/${sku}`}
                className="flex-1 px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-black uppercase tracking-widest text-[11px] shadow-lg hover:brightness-110 hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2"
                style={{ boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
            >
                <Box className="w-4 h-4" /> EXPLORE IN 3D
            </button>
            {/* Secondary: Brand Red — VIEW IN YOUR SPACE */}
            <button
                onClick={() => window.location.href = `/product/${sku}?ar=true`}
                className="flex-1 px-6 py-3 bg-brand-red text-white rounded-lg font-black uppercase tracking-widest text-[11px] shadow-lg shadow-brand-red/30 hover:brightness-110 hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
                <Camera className="w-4 h-4" /> VIEW IN YOUR SPACE
            </button>
        </div>
    );
}
