// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useClient } from '@/engine/context/ClientContext';

// Standard top-level import removed for true lazy initialization
// import '@google/model-viewer';

interface ModelViewerProps {
    src: string;
    alt: string;
    poster?: string;
    autoRotate?: boolean;
    className?: string;
    cameraControls?: boolean;
    variant?: string;
    autoActivateAR?: boolean;
    reveal?: 'auto' | 'manual' | 'interaction';
    loading?: 'auto' | 'lazy' | 'eager';
    priorityLoad?: boolean;
}

// Convert local model paths to Firebase Storage URLs
function resolveModelUrl(originalPath: string) {
    if (!originalPath) return originalPath;
    
    // If it's already an absolute URL (http, https, blob), keep it
    if (originalPath.startsWith('http://') || originalPath.startsWith('https://') || originalPath.startsWith('blob:')) {
        return originalPath;
    }

    // Convert local /assets/models path to Firebase Storage
    if (originalPath.startsWith('/assets/models/')) {
        const filename = originalPath.replace('/assets/models/', '');
        const encodedFilename = encodeURIComponent(filename);
        return `https://firebasestorage.googleapis.com/v0/b/ls-furniture-d53dd.firebasestorage.app/o/assets%2Fmodels%2F${encodedFilename}?alt=media`;
    }

    return originalPath;
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
    loading = 'auto',
    priorityLoad = false
}: ModelViewerProps) {
    const modelRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [showAROverlay, setShowAROverlay] = useState(false);

    // Initial Load Effect - Including Lazy Engine Loading
    useEffect(() => {
        // Dynamically import the model-viewer engine only when this component mounts
        // This prevents WebGL initialization on pages that don't need it (like catalogue)
        import('@google/model-viewer').catch(console.error);

        const modelViewer = modelRef.current;
        if (!modelViewer) return;

        const onLoad = () => {
            console.log('✅ 3D Model Rendered:', src);
            setIsLoading(false);
        };

        const onError = (e: any) => {
            console.error('❌ 3D Load Error:', src, e);
            setLoadError('Failed to load 3D model');
            setIsLoading(false);
        };

        modelViewer.addEventListener('load', onLoad);
        modelViewer.addEventListener('error', onError);

        return () => {
            modelViewer.removeEventListener('load', onLoad);
            modelViewer.removeEventListener('error', onError);
        };
    }, [src]);

    // Dedicated Variant Effect - Reacts to prop changes after load
    useEffect(() => {
        const modelViewer = modelRef.current;
        if (!modelViewer || !modelViewer.model || isLoading) return;

        const applyVariant = () => {
            const material = modelViewer.model.materials[0];
            if (!material) return;

            if (variant && variant !== 'Original') {
                const color = FINISH_COLORS[variant];
                if (color) {
                    material.pbrMetallicRoughness.setBaseColorFactor(color);
                }
            } else {
                material.pbrMetallicRoughness.setBaseColorFactor(FINISH_COLORS['Original']);
            }
        };

        applyVariant();

        // Auto-Activate AR if requested
        if (autoActivateAR && !isLoading) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                setShowAROverlay(true);
            }
        }
    }, [variant, isLoading, autoActivateAR]);

    return (
        <div className={cn("relative w-full h-full bg-brand-sand/10 rounded-3xl overflow-hidden group/viewer", className)}>
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-radial-[at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%] z-0" />

            {/* ERROR STATE */}
            {loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-sand/20 z-50 p-6 text-center">
                    <span className="text-[10px] font-black text-brand-red uppercase italic tracking-widest mb-4">{loadError}</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-[8px] font-bold text-brand-charcoal underline underline-offset-4 uppercase tracking-[0.2em]"
                    >
                        Tap to Refresh
                    </button>
                </div>
            )}

            {/* LOADING SPINNER (Shows until 'load' event) */}
            {isLoading && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-sand/10 z-30">
                    <div className="relative">
                        <div className="w-10 h-10 border-4 border-brand-red/10 rounded-full"></div>
                        <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                </div>
            )}

            {/* ACTUAL MODEL VIEWER */}
            <model-viewer
                ref={modelRef}
                src={resolveModelUrl(src)}
                alt={alt}
                poster={poster}
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-placement="floor"
                auto-rotate={autoRotate ? "" : undefined}
                camera-controls={cameraControls ? "" : undefined}
                shadow-intensity="1.5"
                environment-image="neutral"
                exposure="1.2"
                reveal={reveal}
                loading={loading}
                draco-decoder-path="https://www.gstatic.com/draco/v1/decoders/"
                className="w-full h-full relative z-10"
                style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'transparent' }}
            >
                {/* AR TRIGGER OVERLAY - Satisfies browser user-gesture requirement */}
                {showAROverlay && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center px-6">
                        <div className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm animate-in fade-in duration-500" />
                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-premium flex flex-col items-center text-center animate-in zoom-in-95 duration-500 max-w-xs border border-brand-sand">
                            <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-4">
                                <span className="text-3xl">📱</span>
                            </div>
                            <h4 className="text-xl font-black text-brand-charcoal uppercase italic tracking-tighter mb-2">Ready for <span className="text-brand-red">AR</span></h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 leading-relaxed">
                                Experience this piece in your own space using augmented reality.
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={() => {
                                        if (modelRef.current?.activateAR) {
                                            modelRef.current.activateAR();
                                            setShowAROverlay(false);
                                        }
                                    }}
                                    className="w-full bg-brand-charcoal text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-brand-red transition-all"
                                >
                                    Launch AR Viewer
                                </button>
                                <button
                                    onClick={() => setShowAROverlay(false)}
                                    className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-brand-charcoal transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {(autoActivateAR || showAROverlay) && (
                    <button slot="ar-button" style={{ display: 'none' }} />
                )}
            </model-viewer>

            {/* Interaction Overlay - Subtle Hint */}
            <div slot="poster" className="w-full h-full flex items-center justify-center bg-brand-sand/5">
                {poster && <img src={poster} alt={alt} className="w-full h-full object-contain opacity-50 blur-sm" />}
            </div>
        </div>
    );
}
