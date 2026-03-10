'use client';

import React from 'react';
import { Box, Camera } from 'lucide-react';

interface HeroCTAsProps {
    sku: string;
}

export default function HeroCTAs({ sku }: HeroCTAsProps) {
    return (
        <div className="flex flex-row items-center gap-4 w-full">
            {/* Primary: Brand Charcoal — EXPLORE IN 3D */}
            <button
                onClick={() => window.location.href = `/product/${sku}`}
                className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 shadow-sm"
            >
                <Box className="w-4 h-4" /> FULL 3D
            </button>
            {/* Secondary: Red Accent — VIEW IN YOUR SPACE */}
            <button
                onClick={() => window.location.href = `/product/${sku}?ar=true`}
                className="flex-1 btn-accent py-4 flex items-center justify-center gap-2"
            >
                <Camera className="w-4 h-4" /> VIEW IN YOUR SPACE
            </button>
        </div>
    );
}
