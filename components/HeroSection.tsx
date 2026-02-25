'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import { ArrowRight, Box, Camera, Sparkles, Star, Flame } from 'lucide-react';
import DynamicModelViewer from '@/components/DynamicModelViewer';
import QRCodeModal from '@/components/QRCodeModal';
import dynamic from 'next/dynamic';
import Hover3DPreview from './Hover3DPreview';
import Image from 'next/image';
import { useClient } from '@/engine/context/ClientContext';
import { getFeatureFlags } from '@/engine/config/features';

export default function HeroSection({ heroProduct }: { heroProduct: Product }) {
    const config = useClient();
    const features = getFeatureFlags();
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActivated, setIsActivated] = useState(false);
    const modelViewerRef = useRef<any>(null);

    const handleARLaunch = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            const mv = document.querySelector('model-viewer') as any;
            if (mv) mv.activateAR();
        } else {
            setIsQRModalOpen(true);
        }
    };


    const safePrice = (price: string | null | undefined) => {
        if (!price) return 0;
        return parseInt(price.toString().replace(/[^0-9.]/g, '')) || 0;
    };

    const saveAmount = heroProduct?.WAS ? (safePrice(heroProduct.WAS) - safePrice(heroProduct.NOW)) : 0;

    return (
        <section className="relative min-h-[75vh] flex items-center bg-[#FAFAFA] overflow-hidden rounded-b-[4rem] shadow-premium summer-glow-bg">
            {/* Vivid Summer Gradient Backdrop */}
            <div className="absolute inset-0 summer-gradient opacity-70 pointer-events-none" />

            {/* Bold Yellow Summer Glow */}
            <div className="absolute top-[15%] left-[5%] w-[50rem] h-[50rem] bg-brand-yellow/12 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'summer-glow 4s ease-in-out infinite' }} />
            {/* Red warmth accent */}
            <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-brand-red/6 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'summer-glow 5s ease-in-out infinite' }} />
            {/* Green freshness */}
            <div className="absolute -bottom-40 -left-40 w-[35rem] h-[35rem] bg-brand-green/8 blur-[120px] pointer-events-none" style={{ animation: 'float 6s ease-in-out infinite' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
                {/* ZONE 1 - BRAND ANCHOR (Left) */}
                <div className="lg:col-span-5 text-center lg:text-left animate-in slide-in-from-left duration-1000">
                    <div className="relative">
                        <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter uppercase relative z-10 break-words mb-3 flex flex-col items-center lg:items-start text-left">
                            <span className="text-[5rem] md:text-[6.5rem] text-brand-red drop-shadow-sm leading-none italic mb-1">{config.shortName.split(' ')[0]}</span>
                            <span className="block tracking-tight text-brand-green">{config.name.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <div className="inline-flex items-center gap-2 mb-4 py-2 px-5 rounded-full bg-brand-red text-white font-black text-[11px] uppercase tracking-widest shadow-md">
                            <Flame className="w-4 h-4 text-brand-yellow" />
                            {config.marketing.hotSummerSaleLabel} — Live Now
                        </div>
                        <p className="text-lg font-bold text-brand-gray-neutral tracking-[0.2em] uppercase mb-10">
                            {config.tagline}
                        </p>

                        <div className="space-y-4 mb-8">
                            {/* Removed the extra slogan paragraphs to keep it pure as requested */}
                        </div>

                        {/* CTA Buttons - Upgraded for more "Pop" */}
                        <div className="flex flex-row items-center justify-center lg:justify-start gap-3 w-full mt-6">
                            {features.enableSpatialPlacement && (
                                <button
                                    onClick={handleARLaunch}
                                    className="bg-gradient-to-r from-brand-green to-brand-green-deep text-white py-4 px-6 rounded-full text-[11px] font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(166,192,101,0.5)] hover:shadow-[0_15px_40px_rgba(166,192,101,0.7)] transition-all active:scale-95 flex-1 max-w-[220px] border border-white/20 animate-pulse-slow"
                                >
                                    <Camera className="w-4 h-4" /> VIEW IN YOUR SPACE
                                </button>
                            )}
                            {features.enable3DViewer && (
                                <button
                                    onClick={() => {
                                        modelViewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                    className="bg-gradient-to-r from-[#E31E24] to-[#ff4d4f] text-white py-4 px-6 rounded-full text-[11px] font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(227,30,36,0.4)] hover:shadow-[0_15px_40px_rgba(227,30,36,0.6)] transition-all active:scale-95 flex-1 max-w-[220px] border border-white/20"
                                >
                                    <Box className="w-4 h-4" /> EXPLORE IN 3D
                                </button>
                            )}
                        </div>

                        {/* More visible, summery yellow animated tagline */}
                        <p className="text-[10px] font-black text-brand-yellow uppercase tracking-widest flex items-center justify-center lg:justify-start gap-1.5 mt-6 summer-badge-glow inline-flex w-fit bg-brand-charcoal/80 px-4 py-2 rounded-full">
                            <span className="w-3 h-3 text-brand-yellow animate-pulse">✨</span> POWERED BY 3D AND REAL TIME SPATIAL TECHNOLOGY
                        </p>
                    </div>
                </div>

                {/* ZONE 2 - HERO VISUAL (Right) */}
                <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                    <div
                        ref={modelViewerRef}
                        className="h-[400px] md:h-[600px] w-full relative group animate-in zoom-in duration-1000 mt-2 z-10 cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsActivated(true)}
                    >
                        {/* Soft Contact Shadow beneath the viewer */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-12 bg-black/15 blur-[25px] rounded-full pointer-events-none z-0" />

                        <div className="w-full h-full relative z-10 shadow-premium rounded-[40px] overflow-hidden border border-brand-sand/50 bg-white/40 backdrop-blur-sm">
                            {(features.enable3DViewer && heroProduct?.modelPath) ? (
                                <DynamicModelViewer
                                    src={heroProduct.modelPath}
                                    alt="Hero Product"
                                    autoRotate={true}
                                    cameraControls={true}
                                    autoActivateAR={false}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-brand-sand/20 border-2 border-dashed border-brand-sand rounded-[40px]">
                                    <span className="text-brand-sand/50 font-black text-[8rem] italic uppercase tracking-tighter">{config.shortName.split(' ')[0]}</span>
                                </div>
                            )}
                        </div>

                        {/* PRICE BADGE — Optimized with CSS animations instead of external Lottie */}
                        <div className="absolute -top-6 -right-6 z-30 pointer-events-none flex flex-col items-center">
                            <div className="relative mb-[-15px] z-40">
                                <div className="summer-price-burst">
                                    <Sparkles className="w-12 h-12 text-brand-yellow drop-shadow-lg" style={{ animation: 'spin-slow 8s linear infinite' }} />
                                </div>
                            </div>
                            <div className="bg-brand-red text-white p-3 px-5 rounded-3xl shadow-2xl border-2 border-brand-yellow/50 flex flex-col items-center btn-pulsate relative z-30">
                                <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.3em] drop-shadow-sm mb-1">Now Only</span>
                                <div className="flex items-center text-4xl md:text-5xl font-impact tracking-normal drop-shadow-lg leading-none italic">
                                    <span className="text-base md:text-lg mr-1 mt-1 font-black">P</span>
                                    <span>{heroProduct?.NOW || "---"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                productName={heroProduct?.["Product Name"] || config.shortName}
                sku={heroProduct?.SKU || ""}
            />
        </section>
    );
}
