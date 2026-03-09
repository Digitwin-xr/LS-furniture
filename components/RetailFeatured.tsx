'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';

// Lazy load viewers to ensure homepage loads extremely fast
const DynamicModelViewer = dynamic(() => import('./DynamicModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl" />
});

export default function RetailFeatured({ products }: { products: any[] }) {
    return (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.2em] mb-2">
                            Featured Selection
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Trending Now
                        </h3>
                    </div>
                    <Link
                        href="/catalogue"
                        className="text-gray-900 font-bold hover:text-brand-green transition-colors flex items-center gap-2 group"
                    >
                        View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.slice(0, 6).map((product) => (
                        <div key={product.SKU} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all duration-300 group flex flex-col">

                            {/* Product Image / Viewer Area */}
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-6 group-hover:bg-white transition-colors cursor-pointer" onClick={() => window.location.href = `/product/${product.SKU}`}>
                                {/* Sale Badge */}
                                {product.Discount_Price && (
                                    <div className="absolute top-4 left-4 z-10 bg-brand-green text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md">
                                        Sale
                                    </div>
                                )}

                                <DynamicModelViewer
                                    src={`/assets/models/${product.Model_File}`}
                                    alt={product.Product_Name}
                                    cameraControls={false} // Disable controls in grid to prevent scroll trapping
                                    autoRotate={true}
                                />
                            </div>

                            {/* Product Data */}
                            <div className="px-2 pb-2 flex flex-col flex-grow">
                                <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {product.Product_Name}
                                </h4>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex flex-col">
                                        {product.Discount_Price ? (
                                            <>
                                                <span className="text-sm font-medium text-gray-400 line-through">
                                                    P{parseFloat(product.Price).toLocaleString()}
                                                </span>
                                                <span className="text-2xl font-black text-gray-900">
                                                    P{parseFloat(product.Discount_Price).toLocaleString()}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-black text-gray-900">
                                                P{parseFloat(product.Price).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <Link
                                        href={`/product/${product.SKU}`}
                                        className="bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm tracking-wide text-center transition-colors shadow-md"
                                    >
                                        View Product
                                    </Link>
                                    <button
                                        onClick={() => window.location.href = `/product/${product.SKU}?ar=true`}
                                        className="bg-green-50 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/20 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Camera className="w-4 h-4" /> VIEW IN YOUR SPACE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
