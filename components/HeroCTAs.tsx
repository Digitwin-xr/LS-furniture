'use client';

import React from 'react';
import { Box, Camera } from 'lucide-react';

interface HeroCTAsProps {
    sku: string;
}

export default function HeroCTAs({ sku }: HeroCTAsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
            {/* Primary: Brand Green — EXPLORE IN 3D */}
            <button
                onClick={() => window.location.href = `/product/${sku}`}
                className="flex-1 btn-primary min-h-[56px] md:min-h-[60px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
                <Box className="w-5 h-5" /> EXPLORE IN 3D
            </button>
            {/* Secondary: Red Accent — VIEW IN YOUR SPACE */}
            <button
                onClick={() => window.location.href = `/product/${sku}?ar=true`}
                className="flex-1 btn-accent min-h-[56px] md:min-h-[60px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
                <Camera className="w-5 h-5" /> VIEW IN YOUR SPACE
            </button>
        </div>
    );
}
