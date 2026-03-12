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
                className="btn-primary px-8 py-3.5 sm:py-2.5 min-h-[44px] flex items-center justify-center gap-2"
            >
                <Box className="w-4 h-4" /> <span className="text-[10px] font-black tracking-[0.2em] uppercase">Explore in 3D</span>
            </button>
            {/* Secondary: Red Accent — VIEW IN YOUR SPACE */}
            <button
                onClick={() => window.location.href = `/product/${sku}?ar=true`}
                className="btn-accent px-8 py-3.5 sm:py-2.5 min-h-[44px] flex items-center justify-center gap-2"
            >
                <Camera className="w-4 h-4" /> <span className="text-[10px] font-black tracking-[0.2em] uppercase">View in Your Space</span>
            </button>
        </div>
    );
}
