'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, Heart, Share2, Box, ChevronLeft, Camera, Send, Check, X, ChevronRight, Share, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import ExpressOrderModal from './ExpressOrderModal';
import { useRouter, useSearchParams } from 'next/navigation';

import ModelViewer from './ModelViewer';
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
    { name: 'Red', color: '#E53935' },
];

export default function ProductDetail({ product }: { product: Product }) {
    const config = useClient();
    const router = useRouter();
    const features = getFeatureFlags();
    const searchParams = useSearchParams();
    const autoAR = searchParams.get('ar') === 'true';

    const [selectedFinish, setSelectedFinish] = useState('Original');
    const [isSaved, setIsSaved] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const modelViewerRef = useRef<any>(null);

    // Auto-trigger AR Logic
    useEffect(() => {
        if (autoAR) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (!isMobile) {
                // On desktop, show QR code automatically if navigating from an AR link
                setIsQRModalOpen(true);
            }
        }
    }, [autoAR]);

    // Lock Body Scroll when in Fullscreen
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isFullscreen]);

    const wasPriceParsed = product.WAS ? parseInt(product.WAS.replace(/[^0-9.]/g, '')) : 0;
    const nowPriceParsed = parseInt(product.NOW.replace(/[^0-9.]/g, ''));
    const saveAmount = wasPriceParsed ? (wasPriceParsed - nowPriceParsed) : 0;

    const handleARLaunch = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            const mv = document.querySelector('model-viewer') as any;
            if (mv) mv.activateAR();
        } else {
            setIsQRModalOpen(true);
        }
    };

    const marketingDescription = `Designed for modern living, the ${product["Product Name"]} blends exceptional comfort with clean, contemporary lines. Perfect for creating a sophisticated focal point in your home, offering both style and durability for everyday living.`;

    // Portal-based Fullscreen Viewer — clears all mobile z-index/viewport hurdles
    const FullscreenViewer = isFullscreen && product.modelPath && typeof document !== 'undefined' ? (
        createPortal(
            <div
                data-fullscreen-portal
                style={{ touchAction: 'none', height: '100dvh' }}
                className="fixed inset-0 top-0 left-0 w-full z-[9999] bg-white flex flex-col overflow-hidden"
            >
                {/* Exit Button */}
                <button
                    onClick={() => setIsFullscreen(false)}
                    aria-label="Exit Fullscreen"
                    className="absolute top-5 right-5 z-[10000] bg-brand-red text-white flex items-center gap-2 px-4 py-3 rounded-full hover:bg-red-700 transition-all shadow-2xl active:scale-90 font-black text-[10px] uppercase tracking-widest"
                >
                    <X className="w-5 h-5" />
                    <span className="hidden sm:inline">Exit</span>
                </button>

                {/* Product Name Label */}
                <div className="absolute top-5 left-5 z-[10000]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {product["Product Name"]}
                    </span>
                </div>

                {/* Full-height Model Viewer — no padding clipping */}
                <div className="w-full flex-1 min-h-0">
                    <ModelViewer
                        src={product.modelPath}
                        alt={product["Product Name"]}
                        variant={selectedFinish}
                        autoRotate={false}
                        priorityLoad={true}
                    />
                </div>
            </div>,
            document.body
        )
    ) : null;

    return (
        <>
        {FullscreenViewer}
        <div id={`product-${product.SKU}`} className="max-w-[1400px] mx-auto px-6 py-4 md:py-8 mt-24 relative">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href={`/catalogue#product-${product.SKU}`}
                    onClick={() => {
                        // The SmartGrid handles scroll restoration if coming from history
                        // This direct link ensures we hit the anchor if history is missing or stale
                    }}
                    className="flex items-center gap-2 text-brand-green hover:text-brand-green font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] transition-colors font-inter"
                >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Shop
                </Link>
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            window.history.back();
                        } else {
                            window.location.href = '/catalogue';
                        }
                    }}
                    className="flex items-center gap-2 text-brand-red hover:text-red-700 font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] transition-colors"
                >
                    Back <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start h-full">
                {/* ═══ LEFT: 3D VIEWER ONLY — 70% Desktop ═══ */}
                <div
                    ref={modelViewerRef}
                    className="w-full lg:w-[70%] lg:sticky lg:top-32 h-[400px] sm:h-[600px] lg:h-[75vh] rounded-[2.5rem] bg-[#F8F8F8] relative border border-gray-100 group shadow-inner"
                >
                    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                        {(features.enable3DViewer && product.modelPath) ? (
                            <ModelViewer
                                src={product.modelPath}
                                alt={product["Product Name"]}
                                variant={selectedFinish}
                                autoActivateAR={autoAR}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F8F8F8]">
                                <Box className="w-16 h-16 text-gray-300 animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Viewer Controls */}
                    <div className="absolute bottom-6 right-6 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2 font-inter">
                            <Box className="w-3 h-3 text-brand-red" /> Drag to Rotate
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT: STRUCTURED PRODUCT CARD — 30% Desktop ═══ */}
                <div className="w-full lg:w-[30%] flex flex-col justify-center py-2 lg:pl-4">
                    <div className="bg-white relative">

                        {/* Category Tag */}
                        <div className="mb-4">
                            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                {product.Category}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-[40px] font-serif font-bold text-gray-900 leading-[1.1] mb-2 uppercase">
                            {product["Product Name"]}
                        </h1>

                        {/* SKU */}
                        <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mb-8">
                            Ref: {product.SKU}
                        </p>

                        {/* ── Pricing Block ── */}
                        <div className="flex items-end flex-wrap gap-4 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1 font-inter">Now Only</span>
                                <span className="text-4xl lg:text-5xl font-black text-brand-red tracking-tight leading-none font-inter">
                                    {product.NOW === "Ask for Price" ? "Ask for Price" : `P${product.NOW}`}
                                </span>
                            </div>
                            {product.WAS && (
                                <div className="flex flex-col ml-2 pb-1">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Was</span>
                                    <span className="text-xl lg:text-2xl text-gray-400 line-through font-bold leading-none">
                                        {product.WAS === "Ask for Price" ? "Ask for Price" : `P${product.WAS}`}
                                    </span>
                                </div>
                            )}
                            {saveAmount > 0 && (
                                <div className="ml-2 mb-2 bg-[#FFD700] text-gray-900 px-3 py-1.5 rounded-[4px] text-[11px] font-black tracking-widest uppercase shadow-sm">
                                    SAVE P {saveAmount}
                                </div>
                            )}
                        </div>

                        {/* Product Description */}
                        <p className="text-gray-600 text-[15px] leading-relaxed mb-8 max-w-md">
                            {product.description || `Experience the perfect blend of style and comfort with the ${product["Product Name"]}. A premium choice from the LS Lifestyle collection.`}
                        </p>

                        {/* Compact CTAs */}
                        {product.modelPath && (
                            <div className="flex flex-row gap-3 mb-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {features.enableSpatialPlacement && (
                                    <button
                                        onClick={handleARLaunch}
                                        className="flex-1 btn-accent px-4 py-2.5 min-h-[44px] flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-4 h-4" /> <span className="text-[10px] font-black tracking-widest leading-none">VIEW IN SPACE</span>
                                    </button>
                                )}
                                {features.enable3DViewer && (
                                    <button
                                        onClick={() => setIsFullscreen(true)}
                                        className="flex-1 btn-primary px-4 py-2.5 min-h-[44px] flex items-center justify-center gap-2"
                                    >
                                        <Box className="w-4 h-4" /> <span className="text-[10px] font-black tracking-widest leading-none">FULL 3D</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Variant Selector ── */}
                        <div className="space-y-3 mb-10">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Select Finish</h3>
                            <div className="flex flex-wrap gap-3">
                                {MATERIAL_FINISHES.map((finish) => (
                                    <button
                                        key={finish.name}
                                        onClick={() => setSelectedFinish(finish.name)}
                                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 border ${selectedFinish === finish.name
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        title={finish.name}
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                            style={{ backgroundColor: finish.color }}
                                        />
                                        <span className={`text-[11px] font-bold tracking-wider ${selectedFinish === finish.name ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {finish.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Express Order ── */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="w-full btn-gold min-h-[44px] py-3 md:py-2.5 flex items-center justify-center gap-3 relative group/glow text-[11px] font-black tracking-[0.2em]"
                            >
                                <div className="absolute inset-0 bg-[#D4AF37] blur-xl opacity-0 group-hover/glow:opacity-30 transition-opacity rounded-lg" />
                                <Send className="w-4 h-4 relative z-10" /> <span className="relative z-10">EXPRESS ORDER</span>
                            </button>

                            <div className="grid grid-cols-3 gap-2 pt-2">
                                <button className="border border-[#D4AF37] py-3 rounded-lg text-[9px] font-black text-[#D4AF37] tracking-widest uppercase flex flex-col items-center justify-center gap-1 hover:bg-[#B5952F] hover:text-white hover:border-[#B5952F] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md group/buy relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[#B5952F] blur-xl opacity-0 group-hover/buy:opacity-10 transition-opacity" />
                                    <ShoppingCart className="w-3 h-3 group-hover/buy:scale-110 transition-transform relative z-10" /> <span className="relative z-10">BUY NOW</span>
                                </button>
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`py-3 rounded-lg text-[9px] font-black tracking-widest uppercase flex flex-col items-center justify-center gap-1 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md border relative group/save ${isSaved
                                        ? 'bg-[#D4AF37] border-[#D4AF37] text-white'
                                        : 'bg-white border-[#D4AF37] text-[#D4AF37] hover:bg-[#B5952F] hover:text-white hover:border-[#B5952F]'
                                        }`}
                                >
                                    <div className={`absolute inset-0 blur-xl opacity-0 group-hover/save:opacity-20 transition-opacity ${isSaved ? 'bg-white' : 'bg-[#B5952F]'}`} />
                                    <Heart className={`w-3 h-3 relative z-10 ${isSaved ? 'fill-current' : ''}`} /> <span className="relative z-10">{isSaved ? 'SAVED' : 'SAVE'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: product["Product Name"],
                                                url: window.location.href
                                            });
                                        }
                                    }}
                                    className="border border-[#D4AF37] py-3 rounded-lg text-[9px] font-black text-[#D4AF37] tracking-widest uppercase flex flex-col items-center justify-center gap-1 hover:bg-[#B5952F] hover:text-white hover:border-[#B5952F] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md group/share relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[#B5952F] blur-xl opacity-0 group-hover/share:opacity-10 transition-opacity" />
                                    <Share2 className="w-3 h-3 relative z-10" /> <span className="relative z-10">SHARE</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 mt-12 py-6 border-t border-gray-100">
                            {[
                                {
                                    icon: '📋',
                                    title: 'SIX MONTHS LAY BYE',
                                    bullets: ['No interest', 'No hidden charges']
                                },
                                { icon: '🚚', title: 'SAME DAY DELIVERY' },
                                { icon: '🛡️', title: 'QUALITY GUARANTEED' }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center justify-start text-center gap-1.5">
                                    <span className="text-xl mb-1">{badge.icon}</span>
                                    <span className="text-[9px] font-black uppercase text-gray-900 tracking-tight leading-tight">{badge.title}</span>
                                    {badge.bullets && (
                                        <div className="flex flex-col gap-0.5 mt-0.5">
                                            {badge.bullets.map((b, idx) => (
                                                <span key={idx} className="text-[7px] font-bold text-gray-500 uppercase tracking-tighter opacity-80 leading-none">
                                                    • {b}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
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
        </>
    );
}
