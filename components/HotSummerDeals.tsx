'use client';

import React from 'react';
import Image from 'next/image';
import { Box } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Product3DViewer = dynamic(() => import('./Product3DViewer'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-transparent z-10" />
});

export default function HotSummerDeals({ products }: { products: any[] }) {
    const [isLoaded, setIsLoaded] = React.useState(false);
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
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-green/30 transition-all duration-500 flex flex-col relative group"
                            >
                                {/* Save Badge */}
                                {saveAmount > 0 && (
                                    <div className="absolute top-4 left-4 z-10 bg-[#FFD700] text-gray-900 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm animate-in fade-in zoom-in duration-500">
                                        SAVE P {saveAmount}
                                    </div>
                                )}

                                <Link
                                    href={`/product/${product.SKU}`}
                                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-6 flex items-center justify-center transition-colors duration-500"
                                >
                                    {product.imagePath && (
                                        <Image
                                            src={product.imagePath}
                                            alt={product["Product Name"]}
                                            fill
                                            className={`object-contain p-8 group-hover:scale-105 transition-all duration-1000 ease-out ${isLoaded && product.modelPath ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                                            priority={false}
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
                                        </div>
                                    )}

                                    {!product.imagePath && !product.modelPath && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200 font-serif text-4xl font-bold">LS</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </Link>

                                <div className="flex flex-col flex-grow">
                                    <h4 className="text-[13px] font-black text-brand-charcoal mb-4 leading-tight line-clamp-2 uppercase min-h-[2.5rem]">
                                        {product["Product Name"]}
                                    </h4>

                                    <div className="mt-auto">
                                        <div className="flex items-end flex-wrap gap-4 mb-6">
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

                                        <Link
                                            href={`/product/${product.SKU}`}
                                            className="w-full btn-gold py-4 flex items-center justify-center gap-2 group-hover:shadow-xl active:scale-95 transition-all text-center"
                                        >
                                            VIEW PRODUCT <Box className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                                        </Link>
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
