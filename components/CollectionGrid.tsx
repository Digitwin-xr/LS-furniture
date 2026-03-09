'use client';

import Link from 'next/link';
import { ArrowRight, Sofa, Bed, Utensils, Monitor, Box, Refrigerator, Grid3X3, Fan } from 'lucide-react';
import { Category } from '@/types';

type CategoryItem = {
    name: Category;
    icon: any;
};

const CATEGORIES: CategoryItem[] = [
    { name: 'Sofas', icon: Sofa },
    { name: 'Beds', icon: Bed },
    { name: 'Dining', icon: Utensils },
    { name: 'Tables', icon: Grid3X3 },
    { name: 'Chairs', icon: Box },
    { name: 'Kitchen', icon: Refrigerator },
    { name: 'TV Units', icon: Monitor },
    { name: 'Electronics', icon: Fan },
];

export default function CollectionGrid() {
    return (
        <section className="py-24 bg-brand-sand/10 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-16">
                    <h2 className="text-[12px] font-black text-brand-green uppercase tracking-[0.5em] italic mb-4">
                        Curated Spaces
                    </h2>
                    <h3 className="text-5xl md:text-7xl font-black text-brand-charcoal uppercase italic tracking-tighter font-playfair leading-[0.9]">
                        SHOP BY <br /><span className="text-brand-green">COLLECTION.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {CATEGORIES.map((cat, idx) => (
                        <Link
                            key={cat.name}
                            href={`/catalogue?category=${cat.name}`}
                            className="group relative bg-white p-8 md:p-10 rounded-3xl border border-brand-sand/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between aspect-square md:aspect-auto md:h-64"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Animated Background Blob */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-sand/20 rounded-full blur-2xl group-hover:bg-brand-green/20 group-hover:scale-150 transition-all duration-700 pointer-events-none" />

                            <div className="relative z-10 text-brand-charcoal group-hover:text-brand-green transition-colors duration-500">
                                <cat.icon className="w-8 h-8 md:w-12 md:h-12 stroke-[1.5]" />
                            </div>

                            <div className="relative z-10 mt-auto flex items-end justify-between w-full">
                                <div>
                                    <h4 className="text-xl md:text-3xl font-black text-brand-charcoal uppercase italic tracking-tighter group-hover:-translate-y-1 transition-transform font-playfair">
                                        {cat.name}
                                    </h4>
                                    <span className="text-[9px] font-black text-brand-gray-neutral uppercase tracking-widest mt-1 hidden md:block">
                                        Explore Items
                                    </span>
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-sand flex items-center justify-center bg-white group-hover:bg-brand-green group-hover:border-brand-green group-hover:text-white transition-all text-brand-charcoal shadow-sm">
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
