'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types';
import { Box, Camera, Flame, Share2, ShoppingBag } from 'lucide-react';
import ModelViewer from '@/components/ModelViewer';
import QRCodeModal from '@/components/QRCodeModal';
import { useClient } from '@/engine/context/ClientContext';
import { getFeatureFlags } from '@/engine/config/features';

export default function HeroSection({ heroProduct }: { heroProduct: Product }) {
    const config = useClient();
    const features = getFeatureFlags();
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
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

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 items-center w-full relative z-10">
            
            {/* ZONE 1 - INFORMATION PANEL (Left 35% on Desktop) */}
            <div className="lg:col-span-5 flex flex-col items-start text-left order-1 lg:order-1 space-y-8 animate-in slide-in-from-left duration-1000">
                <div className="space-y-4">
                    <h2 className="text-[12px] font-black text-brand-red uppercase tracking-[0.5em] italic flex items-center gap-3">
                        <div className="w-12 h-[2px] bg-brand-red" /> HOT SUMMER SALE
                    </h2>
                    
                    <h1 className="text-7xl md:text-8xl font-black leading-[0.8] tracking-tighter text-brand-charcoal uppercase italic font-playfair">
                        JULIET<br />
                        <span className="text-brand-red">DAYBED.</span>
                    </h1>
                    
                    <p className="text-sm font-black text-brand-green uppercase tracking-[0.3em] font-playfair bg-brand-green/5 py-2 px-4 rounded-lg inline-block italic">
                        "Luxury Living, Within Reach."
                    </p>

                    {/* Integrated Price (Below Name as requested) */}
                    <div className="pt-4 flex flex-col items-start gap-1">
                        <div className="text-6xl font-black italic tracking-tighter text-brand-charcoal drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)]">
                            {heroProduct?.NOW === "Ask for Price" ? "Ask for Price" : `P ${heroProduct?.NOW}`}
                        </div>
                        <div className="text-[10px] font-black text-brand-red uppercase tracking-widest px-3 py-1 bg-brand-red/5 rounded-full">
                            Save {heroProduct?.SAVE === "Ask for Price" ? "Ask for Price" : `P ${heroProduct?.SAVE || "2,001"}`}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 pt-6">
                    <p className="text-brand-gray-neutral font-medium text-sm leading-relaxed max-w-sm">
                        Experience visual superiority with the Juliet Daybed — a masterpiece of spatial elegance and structural precision, now available for instant AR placement.
                    </p>

                    <div className="flex flex-col gap-4 w-full">
                        <button className="w-full bg-brand-yellow text-brand-charcoal py-5 px-8 rounded-2xl text-[12px] font-black tracking-widest flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all active:scale-95 animate-pulse-subtle">
                            <ShoppingBag className="w-5 h-5" /> BUY NOW SECURELY
                        </button>
                        
                        <div className="flex gap-3">
                            <button className="flex-1 bg-white border-2 border-brand-sand/50 text-brand-charcoal py-4 px-6 rounded-2xl text-[10px] font-black tracking-widest flex items-center justify-center gap-2 hover:border-brand-red hover:text-brand-red transition-all shadow-sm">
                                <Share2 className="w-4 h-4" /> SHARE VIEW
                            </button>
                            <button 
                                onClick={() => modelViewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                className="flex-1 bg-brand-charcoal text-white py-4 px-6 rounded-2xl text-[10px] font-black tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                                <Box className="w-4 h-4" /> EXPLORE 3D
                            </button>
                        </div>
                    </div>
                </div>

                {/* Variant Thumbnails */}
                <div className="pt-8 w-full">
                    <div className="flex items-center gap-2 mb-4">
                         <h4 className="text-[9px] font-black text-brand-gray-neutral uppercase tracking-widest">Select Architectural Finish</h4>
                         <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" /> {/* Adjusted "Mark" position */}
                    </div>
                    <div className="flex gap-4">
                        {[1, 2, 3].map((v) => (
                            <div key={v} className={`w-14 h-14 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${v === 1 ? 'border-brand-red shadow-lg' : 'border-brand-sand'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ZONE 2 - 3D DOMINANT CANVAS (Right 65% on Desktop) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative order-2 lg:order-2">
                <div
                    ref={modelViewerRef}
                    className="h-[450px] md:h-[650px] w-full relative group animate-in fade-in zoom-in duration-1000"
                >
                    {/* Atmospheric Glow */}
                    <div className="absolute inset-x-0 bottom-[-10%] h-[30%] bg-radial-[at_50%_0%,rgba(166,192,101,0.1)_0%,transparent_70%] pointer-events-none" />
                    
                    {/* Curved Visual Container */}
                    <div className="w-full h-full relative z-10 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden border border-brand-sand/60">
                        {(features.enable3DViewer && heroProduct?.modelPath) ? (
                            <ModelViewer
                                src={heroProduct.modelPath}
                                alt={heroProduct["Product Name"]}
                                autoRotate={true}
                                cameraControls={true}
                                autoActivateAR={false}
                                poster={heroProduct.imagePath || undefined}
                                loading="eager"
                                reveal="auto"
                            />
                        ) : (




                            <div className="w-full h-full flex items-center justify-center bg-brand-sand/10">
                                <span className="text-brand-sand/50 font-black text-4xl italic uppercase tracking-tighter">RENDER_IDLE</span>
                            </div>
                        )}
                        
                        {/* Circular AR Trigger Overlay */}
                        <button
                            onClick={handleARLaunch}
                            className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-brand-red text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-30 group/ar"
                        >
                            <Camera className="w-8 h-8 group-hover/ar:rotate-12 transition-transform" />
                            <div className="absolute -inset-2 border-2 border-dashed border-brand-red/30 rounded-full animate-spin-slow pointer-events-none" />
                        </button>
                    </div>

                    {/* Price Badge Removed from here as it is now under the name on the left */}
                </div>
            </div>

            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                productName={heroProduct?.["Product Name"] || config.shortName}
                sku={heroProduct?.SKU || ""}
            />
        </div>
    );
}
