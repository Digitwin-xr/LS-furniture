'use client';

import { Product } from '@/types';
import { useState, useRef } from 'react';
import ModelViewer from './DynamicModelViewer';
import Hover3DPreview from './Hover3DPreview';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Box, ArrowRight } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import { useClient } from '@/engine/context/ClientContext';
import { getFeatureFlags } from '@/engine/config/features';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const config = useClient();
    const features = getFeatureFlags();
    const [isHovered, setIsHovered] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    // Calculate absolute Pula savings
    const saveAmount = product.WAS ? (parseInt(product.WAS) - parseInt(product.NOW)) : 0;

    const handleARLaunch = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `/product/${product.SKU}?ar=true`;
        } else {
            setIsQRModalOpen(true);
        }
    };

    // Mobile Long Press Logic
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        longPressTimer.current = setTimeout(() => {
            setIsHovered(true);
        }, 600);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        setIsHovered(false);
    };

    return (
        <>
            <div
                className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 md:hover:-translate-y-4 flex flex-col h-full shadow-premium hover:shadow-2xl border border-brand-sand/30"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >

                {/* Main Visual Area */}
                <Link
                    href={`/product/${product.SKU}`}
                    className="relative aspect-square overflow-hidden bg-brand-sand/10 spotlight-glow cursor-pointer group/visual"
                >
                    {/* 3D Preview — Revealed on Hover */}
                    {(features.enable3DViewer && product.modelPath) && (
                        <div className={`absolute inset-0 z-10 bg-white transition-all duration-700 ease-out origin-center ${isHovered ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}>
                            {isHovered && (
                                <Hover3DPreview
                                    modelPath={product.modelPath}
                                    alt={product["Product Name"]}
                                />
                            )}
                        </div>
                    )}

                    {/* Main Static Image (Visible when not hovering) */}
                    {product.imagePath ? (
                        <div className={`relative w-full h-full p-8 transition-opacity duration-500 group-hover/visual:scale-110 ${isHovered ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                            <Image
                                src={product.imagePath}
                                alt={product["Product Name"]}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-brand-sand bg-brand-sand/5">
                            <div className="w-20 h-20 rounded-2xl bg-white/50 border-2 border-brand-sand/30 flex items-center justify-center mb-2 shadow-inner">
                                <span className="text-3xl font-black text-brand-charcoal/5 uppercase italic">{config.shortName.split(' ')[0]}</span>
                            </div>
                        </div>
                    )}

                    {/* Quick Action Buttons — Removed from here to move below name */}
                </Link>

                {/* Info Section */}
                <Link href={`/product/${product.SKU}`} className="p-4 md:p-5 flex flex-col flex-grow bg-white relative z-0">
                    <div className="mb-2 relative w-fit mt-1">
                        <span className="text-[9px] px-2 py-0.5 bg-[#A6C065]/10 rounded-full text-[#A6C065] font-black uppercase tracking-[0.2em]">
                            {product.Category}
                        </span>
                    </div>

                    <h3 className="text-sm md:text-base font-black text-[#343F48] tracking-tight leading-tight mb-2 line-clamp-1 group-hover:text-brand-red transition-all duration-500 uppercase">
                        {product["Product Name"]}
                    </h3>

                    {/* High Conversion Pricing Block */}
                    <div className="flex flex-col gap-1 mb-5">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-black text-[#E51E25] tracking-tighter italic leading-none">
                                P {product.NOW}
                            </span>
                            {product.WAS && (
                                <span className="text-[10px] md:text-xs text-[#8FA3B0] line-through font-bold opacity-70 italic">
                                    WAS P {product.WAS}
                                </span>
                            )}
                        </div>
                        {product.WAS && saveAmount > 0 && (
                            <div className="inline-flex mt-1">
                                <span className="bg-[#FFE600]/80 text-[#343F48] px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border border-[#FFE600]">
                                    SAVE P {saveAmount}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Standardized CTAs — Side-by-Side Flex Layout, Hierarchy Upgraded */}
                    {product.modelPath && (
                        <div className="flex flex-row gap-2 mt-auto pt-2 w-full">
                            {features.enableSpatialPlacement && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleARLaunch(e);
                                    }}
                                    className="flex-[3] bg-gradient-to-r from-brand-green to-brand-green-deep text-white py-2.5 rounded-xl text-[8px] font-black tracking-widest flex items-center justify-center gap-1.5 shadow-[0_5px_15px_rgba(166,192,101,0.4)] hover:shadow-[0_8px_20px_rgba(166,192,101,0.6)] transition-all active:scale-95 border border-white/20 animate-pulse-slow"
                                >
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>VIEW IN YOUR SPACE</span>
                                </button>
                            )}
                            {features.enable3DViewer && (
                                <div
                                    className="flex-[2] bg-gradient-to-r from-[#E31E24] to-[#ff4d4f] text-white py-2.5 rounded-xl text-[8px] font-black tracking-widest flex items-center justify-center gap-1.5 shadow-[0_5px_15px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_20px_rgba(227,30,36,0.5)] transition-all active:scale-95 border border-white/20 animate-pulse-slow"
                                >
                                    <Box className="w-3.5 h-3.5" />
                                    <span>EXPLORE IN 3D</span>
                                </div>
                            )}
                        </div>
                    )}
                </Link>
            </div>

            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                productName={product["Product Name"]}
                sku={product.SKU}
            />
        </>
    );
}
