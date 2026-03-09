'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Camera } from 'lucide-react';
import Link from 'next/link';

const DynamicModelViewer = dynamic(() => import('./DynamicModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl" />
});

export default function HotSummerDeals({ products }: { products: any[] }) {
    // Final curated "Explore Our Deals" lineup as requested
    const targetSKUs = [
        '52600',    // Magnificent King 20 Star Bed
        '5900',     // Juliet Daybed Sofa Can Stan
        'MWOC14A',  // Occasional Chair Orange/Teal/Grey
        'MWOC16A_2',// Mwoc16a Accent Chair Black Grey Orange
        'MW23',     // TV Cabinet UK Oak + Black
        'MWBR684',  // TV Stand Londres Off White/Mat
        '16155',    // Romeo Kitchen Combo BAF
        '251024'    // Sofa Shadow Corner L Shape PAK
    ];
    const deals = targetSKUs.map(sku => products.find(p => p.SKU === sku)).filter(Boolean);

    return (
        <section className="py-20 bg-[#F9FDF4] border-t border-brand-green-light">
            <div className="max-w-[1400px] mx-auto px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[11px] mb-2 flex items-center gap-2">
                            From contemporary living rooms to essential home appliances &mdash; discover pieces designed for modern living.
                        </h2>
                        <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
                            Explore Our Collections
                        </h3>
                    </div>
                    <Link href="/catalogue?deals=true" className="text-brand-green font-bold text-sm tracking-widest uppercase mt-4 md:mt-0 hover:text-brand-green-deep border-b-2 border-brand-green pb-1 transition-colors">
                        View All Deals
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {deals.map((product: any) => {
                        const wasPrice = product.WAS ? parseInt(product.WAS.replace(/[^0-9.]/g, '')) : 0;
                        const nowPrice = parseInt(product.NOW.replace(/[^0-9.]/g, ''));
                        const saveAmount = wasPrice > 0 ? (wasPrice - nowPrice) : 0;

                        return (
                            <div
                                key={product.SKU}
                                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-green/20 transition-all duration-200 flex flex-col relative group"
                            >
                                {/* Save Badge */}
                                {saveAmount > 0 && (
                                    <div className="absolute top-4 left-4 z-10 bg-[#FFD700] text-gray-900 px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase shadow-sm">
                                        SAVE P {saveAmount}
                                    </div>
                                )}

                                <div
                                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-5 group-hover:bg-white transition-all duration-200 cursor-pointer overflow-hidden group-hover:scale-[1.02]"
                                    onClick={() => window.location.href = `/product/${product.SKU}`}
                                >
                                    {product.modelPath ? (
                                        <DynamicModelViewer
                                            src={product.modelPath}
                                            alt={product["Product Name"]}
                                            cameraControls={false}
                                            autoRotate={true}
                                            loading="lazy"
                                            reveal="auto"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif text-4xl font-bold">LS</div>
                                    )}
                                </div>

                                {/* Dual CTAs: Immediately below the viewer */}
                                <div className="flex gap-2 w-full px-2 mb-4">
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

                                <div className="flex flex-col flex-grow px-2">
                                    <h4 className="text-[14px] font-bold text-gray-900 mb-3 leading-snug line-clamp-2 uppercase h-[40px]">
                                        {product["Product Name"]}
                                    </h4>

                                    <div className="mt-auto mb-2">
                                        <div className="flex items-end flex-wrap gap-3">
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
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
