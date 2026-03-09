'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const DynamicModelViewer = dynamic(() => import('./DynamicModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl" />
});

export default function RetailBestSellers({ products }: { products: any[] }) {
    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-12">
                    <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.2em] mb-2">
                        Customer Favorites
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Best Sellers
                    </h3>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x no-scrollbar">
                    {products.map((product) => (
                        <div
                            key={product.SKU}
                            className="min-w-[280px] w-[280px] bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all duration-300 group flex flex-col snap-start"
                        >

                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 group-hover:bg-white transition-colors cursor-pointer" onClick={() => window.location.href = `/product/${product.SKU}`}>
                                <DynamicModelViewer
                                    src={`/assets/models/${product.Model_File}`}
                                    alt={product.Product_Name}
                                    cameraControls={false}
                                    autoRotate={true}
                                />
                            </div>

                            <div className="flex flex-col flex-grow">
                                <h4 className="text-base font-bold text-gray-900 mb-2 truncate">
                                    {product.Product_Name}
                                </h4>

                                <span className="text-xl font-black text-gray-900 mb-4">
                                    P{parseFloat(product.Discount_Price || product.Price).toLocaleString()}
                                </span>

                                <Link
                                    href={`/product/${product.SKU}`}
                                    className="mt-auto w-full bg-white border-2 border-gray-200 hover:border-brand-green text-gray-900 hover:text-brand-green py-3 rounded-xl font-bold text-xs tracking-wide text-center transition-colors uppercase shadow-sm"
                                >
                                    Quick View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
