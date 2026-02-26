// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { cn } from '@/lib/utils';
import { useClient } from '@/engine/context/ClientContext';



// Global declaration moved to types/model-viewer.d.ts

interface ModelViewerProps {
    src: string;
    alt: string;
    poster?: string;
    autoRotate?: boolean;
    className?: string;
    cameraControls?: boolean;
    variant?: string; // New: variant for material switching
    autoActivateAR?: boolean; // New: auto-launch AR
    reveal?: 'auto' | 'manual' | 'interaction';
    priorityLoad?: boolean; // New: allow eager loading for Hero
}

const FINISH_COLORS: Record<string, [number, number, number, number]> = {
    'Original': [1, 1, 1, 1],
    'White': [1, 1, 1, 1],
    'Orange': [1, 0.5, 0, 1],
    'Yellow': [1, 0.95, 0, 1],
    'Grey': [0.5, 0.5, 0.5, 1],
    'Teal': [0, 0.5, 0.5, 1],
    'Light Blue': [0.5, 0.8, 1, 1],
    'Red': [0.77, 0.12, 0.16, 1],
};

export default function ModelViewer({
    src,
    alt,
    poster,
    autoRotate = true,
    className,
    cameraControls = true,
    variant = 'Original',
    autoActivateAR = false,
    reveal = 'auto',
    priorityLoad = false
}: ModelViewerProps) {
    const config = useClient();
    const modelRef = useRef<any>(null);

    // Spatial UX States
    const [isRotating, setIsRotating] = useState(autoRotate);
    const [showTooltip, setShowTooltip] = useState(true);
    const [isPulsing, setIsPulsing] = useState(true);

    const safeSrc = src;

    useEffect(() => {
    }, [src]);

    useEffect(() => {
        const modelViewer = modelRef.current;
        if (modelViewer) {
            const onLoad = () => {
                console.log('✅ Model loaded successfully:', src);

                if (autoActivateAR) {
                    setTimeout(() => {
                        modelViewer.activateAR();
                    }, 500);
                }
            };

            const onError = (error: any) => {
                console.warn('⚠️ Error loading model:', src, error?.message || '');
            };

            modelViewer.addEventListener('load', onLoad);
            modelViewer.addEventListener('error', onError);

            return () => {
                modelViewer.removeEventListener('load', onLoad);
                modelViewer.removeEventListener('error', onError);
            };
        }
    }, [src, autoActivateAR]);

    // Expose reveal function to parent via ref if needed, or handle prop change
    useEffect(() => {
        const modelViewer = modelRef.current;
        if (modelViewer && reveal === 'auto' && src) {
            // Usually just setting the attribute is enough
        }
    }, [reveal, src]);

    // Handle 3-second auto-rotate timeout & 5-second tooltip/pulse fade
    useEffect(() => {
        const rotateTimer = setTimeout(() => setIsRotating(false), 3000);
        const pulseTimer = setTimeout(() => setIsPulsing(false), 4000);
        const tooltipTimer = setTimeout(() => setShowTooltip(false), 5000);

        return () => {
            clearTimeout(rotateTimer);
            clearTimeout(pulseTimer);
            clearTimeout(tooltipTimer);
        };
    }, []);

    const handleInteraction = () => {
        setIsRotating(false);
        setShowTooltip(false);
        setIsPulsing(false);
    };

    return (
        <div className={cn("relative w-full h-full bg-brand-sand/10 rounded-3xl overflow-hidden transition-all duration-300", isPulsing ? "animate-pulse-subtle" : "", className)}>
            <Script
                type="module"
                src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
                strategy="lazyOnload"
            />
            {/* Stylish "Holder" effects */}
            <div className="absolute inset-0 bg-radial-[at_50%_50%,rgba(0,0,0,0.05)_0%,transparent_70%]" />


            {/* Interaction Tooltip */}
            <div className={cn(
                "absolute top-4 left-1/2 -translate-x-1/2 bg-[#343F48]/90 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest z-20 pointer-events-none transition-opacity duration-700 shadow-xl border border-white/10 flex items-center gap-2",
                showTooltip ? "opacity-100" : "opacity-0 invisible"
            )}>
                <div className="w-2 h-2 bg-[#FFE600] rounded-full animate-pulse"></div>
                Drag to explore in 360°
            </div>

            {/* @ts-ignore */}
            <model-viewer
                ref={modelRef}
                src={safeSrc}
                alt={alt}
                auto-rotate
                camera-controls
                camera-target="auto auto auto"
                bounds="tight"
                draco-decoder-path="/draco/"
                shadow-intensity="1"
                className="w-full h-full"
                style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'transparent' }}
                onContextMenu={(e: any) => e.preventDefault()}
                onCameraChange={handleInteraction}
                onInteraction={handleInteraction}
            >
                <button slot="ar-button" style={{ display: 'none' }} />
            </model-viewer>
        </div>
    );
}
