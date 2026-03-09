'use client';

import { Product } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Box, Camera } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicModelViewer = dynamic(() => import('./DynamicModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
});

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    // null = checking, true = ok, false = unavailable
    const [modelOk, setModelOk] = useState<boolean | null>(
        product.modelPath ? null : false
    );

    // Detect mobile for WebGL optimization
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Pre-validate the model URL to silently catch 404s before rendering model-viewer
    // Only run if NOT on mobile to save network/GPU
    useEffect(() => {
        if (!product.modelPath || isMobile) { 
            if (isMobile) setModelOk(false);
            else if (!product.modelPath) setModelOk(false);
            return; 
        }
        let cancelled = false;
        fetch(product.modelPath, { method: 'HEAD' })
            .then(res => { if (!cancelled) setModelOk(res.ok); })
            .catch(() => { if (!cancelled) setModelOk(false); });
        return () => { cancelled = true; };
    }, [product.modelPath, isMobile]);

    const wasPrice = product.WAS ? parseInt(product.WAS.replace(/[^0-9.]/g, '')) : 0;
    const nowPrice = parseInt((product.NOW || '0').replace(/[^0-9.]/g, ''));
    const saveAmount = wasPrice > 0 ? (wasPrice - nowPrice) : 0;

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 md:hover:-translate-y-1 flex flex-col h-full border border-gray-100 hover:shadow-xl hover:border-brand-green/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Save Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                {saveAmount > 0 && (
                    <span className="text-gray-900 bg-[#FFD700] px-2 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm">
                        SAVE P {saveAmount}
                    </span>
                )}
            </div>

            {/* Thumbnail / Model Area */}
            <Link
                href={`/product/${product.SKU}`}
                className="relative aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors duration-500"
            >
                {/* HEAD check in progress */}
                {modelOk === null && (
                    <div className="w-full h-full bg-gray-100 animate-pulse" />
                )}

                {/* Model is confirmed reachable — render 3D viewer */}
                {modelOk === true && (
                    <DynamicModelViewer
                        src={product.modelPath!}
                        alt={product["Product Name"]}
                        cameraControls={false}
                        autoRotate={true}
                        loading="lazy"
                        reveal="auto"
                    />
                )}

                {/* Model unavailable (404 or no path) — show image or clean placeholder */}
                {modelOk === false && (
                    product.imagePath ? (
                        <Image
                            src={product.imagePath}
                            alt={product["Product Name"]}
                            fill
                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-200">
                            <span className="font-serif text-4xl font-bold select-none">LS</span>
                            <span className="text-[8px] font-bold tracking-[0.3em] uppercase">Preview Unavailable</span>
                        </div>
                    )
                )}
            </Link>

            {/* Dual CTAs - Immediately below the viewer */}
            <div className="flex gap-2 w-full px-5 py-2">
                <Link
                    href={`/product/${product.SKU}`}
                    className="flex-1 bg-brand-green text-white py-3 rounded-lg text-[11px] font-black tracking-widest flex items-center justify-center gap-1.5 transition-all duration-300 uppercase shadow-md shadow-brand-green/20 hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                >
                    <Box className="w-4 h-4" /> EXPLORE IN 3D
                </Link>
                <Link
                    href={`/product/${product.SKU}?ar=true`}
                    className="flex-1 bg-brand-red text-white py-3 rounded-lg text-[11px] font-black tracking-widest flex items-center justify-center gap-1.5 transition-all duration-300 uppercase shadow-md shadow-brand-red/20 hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                >
                    <Camera className="w-4 h-4" /> VIEW IN SPACE
                </Link>
            </div>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight leading-snug mb-2 uppercase line-clamp-2">
                    {product["Product Name"]}
                </h3>

                {/* Pricing */}
                <div className="flex items-end flex-wrap gap-3 mt-auto mb-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Now Only</span>
                        <span className="text-brand-red font-black text-xl leading-none">
                            {product.NOW === "Ask for Price" ? "Ask for Price" : `P${product.NOW}`}
                        </span>
                    </div>
                    {wasPrice > 0 && (
                        <div className="flex flex-col pb-0.5">
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Was</span>
                            <span className="text-[12px] text-gray-400 line-through font-bold leading-none">
                                P{product.WAS}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
