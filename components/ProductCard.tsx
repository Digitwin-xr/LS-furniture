'use client';

import { Product } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Box } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicModelViewer = dynamic(() => import('./DynamicModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
});

const Product3DViewer = dynamic(() => import('./Product3DViewer'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-transparent z-10" />
});

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const wasPrice = product.WAS ? parseInt(product.WAS.replace(/[^0-9.]/g, '')) : 0;
    const nowPrice = parseInt((product.NOW || '0').replace(/[^0-9.]/g, ''));
    const saveAmount = wasPrice > 0 ? (wasPrice - nowPrice) : 0;

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-brand-green/30 border border-gray-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Save Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                {saveAmount > 0 && (
                    <span className="text-gray-900 bg-[#FFD700] px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm animate-in fade-in zoom-in duration-500">
                        SAVE P {saveAmount}
                    </span>
                )}
            </div>

            {/* Thumbnail Area - Live 3D Previews Enabled */}
            <Link
                href={`/product/${product.SKU}`}
                className="relative aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden transition-colors duration-500"
            >
                {product.imagePath && (
                    <Image
                        src={product.imagePath}
                        alt={product["Product Name"]}
                        fill
                        className={`object-contain p-8 group-hover:scale-105 transition-all duration-1000 ease-out ${isLoaded && product.modelPath ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                        priority={false}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}

                {/* Always-On 3D Preview (Lazy-Loaded) */}
                {product.modelPath && (
                    <div className="absolute inset-0 z-20 animate-in fade-in zoom-in duration-1000">
                        <Product3DViewer 
                            modelPath={product.modelPath} 
                            alt={product["Product Name"]} 
                            onLoad={() => setIsLoaded(true)}
                        />
                        {/* Invisible trigger to help detect "ready" state if needed, 
                            but for now we'll rely on the viewer's transiton */}
                    </div>
                )}

                {!product.imagePath && !product.modelPath && (
                    <div className="flex flex-col items-center gap-2 text-gray-200">
                        <span className="font-serif text-4xl font-bold select-none">LS</span>
                        <span className="text-[8px] font-bold tracking-[0.3em] uppercase">No Preview</span>
                    </div>
                )}
                
                {/* Visual Polish Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Link>

            {/* Info Section */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-[13px] font-black text-brand-charcoal tracking-tight leading-tight mb-3 uppercase line-clamp-2 min-h-[2.5rem]">
                    {product["Product Name"]}
                </h3>

                {/* Pricing */}
                <div className="flex items-end flex-wrap gap-4 mt-auto mb-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest leading-none mb-1">Exclusive Price</span>
                        <span className="text-brand-red font-black text-2xl leading-none tracking-tighter">
                            {product.NOW === "Ask for Price" ? "Ask for Price" : `P${product.NOW}`}
                        </span>
                    </div>
                    {wasPrice > 0 && (
                        <div className="flex flex-col mb-0.5">
                            <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest leading-none mb-1">Was</span>
                            <span className="text-[13px] text-gray-300 line-through font-extrabold leading-none">
                                P{product.WAS}
                            </span>
                        </div>
                    )}
                </div>

                {/* Single Refined CTA */}
                <Link
                    href={`/product/${product.SKU}`}
                    className="w-full btn-gold py-4 flex items-center justify-center gap-2 group-hover:shadow-xl active:scale-95"
                >
                    VIEW PRODUCT <Box className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
