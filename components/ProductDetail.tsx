'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types';
import { ShoppingCart, Heart, Share2, Box, ChevronLeft, Camera, Send, Check } from 'lucide-react';
import Link from 'next/link';
import ExpressOrderModal from './ExpressOrderModal';
import { useSearchParams } from 'next/navigation';

import ModelViewer from './ModelViewer';
import HotSummerBadge from './HotSummerBadge';
import ShareButton from './ShareButton';
import QRCodeModal from './QRCodeModal';
import { useClient } from '@/engine/context/ClientContext';
import { getFeatureFlags } from '@/engine/config/features';

const MATERIAL_FINISHES = [
    { name: 'Original', color: '#FFFFFF' },
    { name: 'White', color: '#F0F0F0' },
    { name: 'Orange', color: '#FF8C00' },
    { name: 'Yellow', color: '#FFF200' },
    { name: 'Grey', color: '#808080' },
    { name: 'Teal', color: '#008080' },
    { name: 'Light Blue', color: '#ADD8E6' },
    { name: 'Red', color: '#C41E29' },
];

export default function ProductDetail({ product }: { product: Product }) {
    const config = useClient();
    const features = getFeatureFlags();
    const searchParams = useSearchParams();
    const autoAR = searchParams.get('ar') === 'true';

    const [selectedFinish, setSelectedFinish] = useState('Original');
    const [isSaved, setIsSaved] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const modelViewerRef = useRef<any>(null);

    const saveAmount = product.WAS ? (parseInt(product.WAS.replace(/[^0-9.]/g, '')) - parseInt(product.NOW.replace(/[^0-9.]/g, ''))) : 0;
    const savePercentage = product.WAS ? Math.round((saveAmount / parseInt(product.WAS.replace(/[^0-9.]/g, ''))) * 100) : 0;

    const handleARLaunch = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            const mv = document.querySelector('model-viewer') as any;
            if (mv) mv.activateAR();
        } else {
            setIsQRModalOpen(true);
        }
    };

    // Lifestyle-focused marketing description (no technical specs)
    const marketingDescription = `Designed for modern living, the ${product["Product Name"]} blends exceptional comfort with clean, contemporary lines. Perfect for creating a sophisticated focal point in your home, offering both style and durability for everyday living.`;

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-4 md:py-8">
            <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 text-brand-charcoal hover:text-brand-green-deep font-bold uppercase text-[9px] tracking-[0.2em] mb-6 transition-all group relative z-50 backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full border border-brand-sand shadow-sm"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-brand-green" />
                Back to Collection
            </Link>

            <div className="flex flex-col lg:flex-row gap-6 items-start h-full">
                {/* ═══ LEFT: 3D VIEWER ONLY — 60% Desktop ═══ */}
                <div
                    ref={modelViewerRef}
                    className="w-full lg:w-[60%] lg:sticky lg:top-24 h-[400px] lg:h-[70vh] rounded-[2rem] bg-brand-sand/30 overflow-hidden relative border border-brand-sand shadow-sm group"
                >

                    {(features.enable3DViewer && product.modelPath) ? (
                        <ModelViewer
                            src={product.modelPath}
                            alt={product["Product Name"]}
                            variant={selectedFinish}
                            autoActivateAR={autoAR}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-sand/30">
                            <Box className="w-16 h-16 text-brand-sand/50 animate-pulse" />
                        </div>
                    )}

                    {/* Viewer Controls */}
                    <div className="absolute bottom-4 right-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-[8px] font-bold uppercase tracking-widest text-brand-gray-neutral flex items-center gap-2">
                            <Box className="w-2.5 h-2.5 text-brand-green" /> Drag to Rotate
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT: STRUCTURED PRODUCT CARD — 40% Desktop ═══ */}
                <div className="w-full lg:w-[40%] flex flex-col justify-center py-2 lg:pl-4">
                    <div className="bg-white rounded-[1.5rem] p-6 lg:p-7 shadow-premium border border-brand-sand/60 relative overflow-hidden">

                        {/* Category Tag */}
                        <div className="mb-2 relative w-fit mt-2">
                            <span className="text-[10px] text-[#A6C065] font-black uppercase tracking-[0.3em]">
                                {product.Category}
                            </span>
                            <div className="w-1.5 h-1.5 bg-[#E51E25] rounded-full absolute -bottom-1 left-4"></div>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-2xl lg:text-3xl font-black text-[#343F48] tracking-tight leading-tight mb-2 uppercase">
                            {product["Product Name"]}
                        </h1>

                        {/* SKU */}
                        <p className="text-[#8FA3B0] font-medium uppercase tracking-[0.2em] text-[9px] opacity-80 mb-4">
                            Ref: {product.SKU}
                        </p>

                        {/* ── Pricing Block ── */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl lg:text-5xl font-black text-[#E51E25] tracking-tighter italic leading-none">
                                P {product.NOW}
                            </span>
                            {product.WAS && (
                                <span className="text-sm lg:text-base text-[#8FA3B0] line-through font-black opacity-80 italic">
                                    P {product.WAS}
                                </span>
                            )}
                        </div>

                        {/* Marketing Description */}
                        <p className="text-[#343F48]/80 text-[14px] lg:text-[15px] font-medium leading-relaxed mb-6 max-w-md">
                            {marketingDescription}
                        </p>

                        {/* Standardized CTAs — Side-by-side layout, Hierarchy Upgraded */}
                        {product.modelPath && (
                            <div className="flex flex-row gap-3 mb-8 w-full mt-4">
                                {features.enableSpatialPlacement && (
                                    <button
                                        onClick={handleARLaunch}
                                        className="flex-[3] bg-gradient-to-r from-brand-green to-brand-green-deep text-white py-4 rounded-2xl text-[10px] sm:text-xs font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(166,192,101,0.4)] hover:shadow-[0_15px_35px_rgba(166,192,101,0.6)] transition-all active:scale-95 border-b-4 border-black/20 animate-pulse-slow"
                                    >
                                        <Camera className="w-4 h-4" /> VIEW IN YOUR SPACE
                                    </button>
                                )}
                                {features.enable3DViewer && (
                                    <button
                                        onClick={() => {
                                            modelViewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }}
                                        className="flex-[2] bg-gradient-to-r from-[#E31E24] to-[#ff4d4f] text-white hover:text-white border-2 border-transparent hover:border-white/20 py-4 rounded-2xl text-[9px] sm:text-[10px] font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(227,30,36,0.3)] hover:shadow-[0_15px_35px_rgba(227,30,36,0.5)] transition-all active:scale-95 animate-pulse-slow"
                                    >
                                        <Box className="w-4 h-4" /> EXPLORE IN 3D
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Conversion Trust Badges Layer */}
                        <div className="grid grid-cols-4 gap-2 mb-8 pt-6 border-t border-brand-sand/30">
                            {[
                                { icon: '🛡️', label: 'Secure Checkout' },
                                { icon: '⭐', label: 'Quality Guaranteed' },
                                { icon: '🚚', label: 'Fast Delivery' },
                                { icon: '🔄', label: 'Easy Returns' }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center justify-center text-center gap-1.5 p-2 bg-white rounded-xl shadow-sm border border-brand-sand/30">
                                    <span className="text-sm">{badge.icon}</span>
                                    <span className="text-[7px] leading-tight font-black uppercase text-brand-charcoal/60 tracking-widest">{badge.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Product Dimensions Panel (Collapsible) */}
                        <details className="group border border-brand-sand/50 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <summary className="flex justify-between items-center font-bold text-xs uppercase tracking-widest text-[#343F48] cursor-pointer p-5 select-none list-none [&::-webkit-details-marker]:hidden">
                                Product Dimensions
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9" /></svg>
                                </span>
                            </summary>
                            <div className="px-5 pb-5 text-sm text-brand-gray-neutral flex flex-col gap-3 pt-2 border-t border-brand-sand/20">
                                {/* Conditional Rendering based on Schema */}
                                {(product as any).Width || (product as any).Depth || (product as any).Height ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {(product as any).Width && (
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-1">Width</span>
                                                <span className="text-sm font-bold text-brand-charcoal">{(product as any).Width}</span>
                                            </div>
                                        )}
                                        {(product as any).Depth && (
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-1">Depth</span>
                                                <span className="text-sm font-bold text-brand-charcoal">{(product as any).Depth}</span>
                                            </div>
                                        )}
                                        {(product as any).Height && (
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-1">Height</span>
                                                <span className="text-sm font-bold text-brand-charcoal">{(product as any).Height}</span>
                                            </div>
                                        )}
                                        {(product as any).Weight && (
                                            <div className="flex flex-col col-span-3 pt-2 mt-2 border-t border-brand-sand/10">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-1">Weight</span>
                                                <span className="text-sm font-bold text-brand-charcoal">{(product as any).Weight}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs italic text-brand-charcoal/50">Detailed spatial dimensions are being updated for this product.</p>
                                )}
                            </div>
                        </details>

                        {/* ── Variant Selector (Oval Finishers) ── */}
                        <div className="space-y-2.5 mb-6">
                            <h3 className="text-[9px] font-black text-brand-charcoal uppercase tracking-[0.2em]">Select Finish</h3>
                            <div className="flex flex-wrap gap-2">
                                {MATERIAL_FINISHES.map((finish) => (
                                    <button
                                        key={finish.name}
                                        onClick={() => setSelectedFinish(finish.name)}
                                        className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 border-2 ${selectedFinish === finish.name
                                            ? 'border-brand-yellow bg-brand-yellow/10 scale-105 shadow-md'
                                            : 'border-brand-sand hover:border-brand-yellow/50'
                                            }`}
                                        title={finish.name}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full border border-brand-sand/40 shadow-inner"
                                            style={{ backgroundColor: finish.color }}
                                        />
                                        <span className={`text-[8px] font-black uppercase tracking-wider ${selectedFinish === finish.name ? 'text-brand-charcoal' : 'text-brand-gray-neutral'}`}>
                                            {finish.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── CTA Cluster ── */}
                        <div className="space-y-3">
                            <hr className="border-brand-sand my-2" />

                            {/* EXPRESS ORDER — Primary CTA */}
                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="w-full btn-accent py-4 text-sm flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-xl relative overflow-hidden btn-pulsate"
                            >
                                <Send className="w-4 h-4" /> Express Order
                            </button>

                            {/* Buy Now / Save / Share */}
                            <div className="grid grid-cols-3 gap-2">
                                <button className="btn-secondary py-3 text-[8px] tracking-widest flex items-center justify-center gap-1.5">
                                    <ShoppingCart className="w-3 h-3" /> Buy Now
                                </button>
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`py-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border-2 ${isSaved
                                        ? 'bg-brand-red text-white border-brand-red'
                                        : 'bg-transparent border-brand-sand text-brand-charcoal hover:border-brand-red hover:text-brand-red'
                                        }`}
                                >
                                    <Heart className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
                                </button>
                                <ShareButton productName={product["Product Name"]} sku={product.SKU} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ExpressOrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                product={product}
                variant={selectedFinish}
            />

            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                productName={product["Product Name"]}
                sku={product.SKU}
            />
        </div>
    );
}
