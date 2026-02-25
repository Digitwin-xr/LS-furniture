'use client';

import { Product, Category } from '@/types';
import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface SmartGridProps {
    products: Product[];
    initialCategory?: Category;
}

const CATEGORIES: Category[] = [
    "All",
    "Electronics",
    "Sofas",
    "Chairs",
    "Wardrobes",
    "Storage",
    "Beds",
    "Kitchen",
    "TV Units",
    "Dining"
];

export default function SmartGrid({ products, initialCategory = "All" }: SmartGridProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = selectedCategory === "All" || product.Category === selectedCategory;
            const matchesSearch = product["Product Name"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.SKU.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="mb-12 space-y-4">
                <div className="flex flex-col gap-6 w-full">
                    {/* Category Filter — Red active, yellow hover */}
                    <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 w-full md:w-auto no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    whitespace-nowrap px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all
                                    ${selectedCategory === cat
                                        ? 'bg-brand-red text-white shadow-xl shadow-brand-red/20 scale-105'
                                        : 'bg-white text-brand-charcoal/60 hover:text-brand-red hover:bg-brand-yellow/10 border-2 border-brand-sand/50 hover:border-brand-yellow/40'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search — Yellow focus */}
                    <div className="relative w-full md:w-80 group">
                        <input
                            type="text"
                            placeholder="Search our collection..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-brand-sand/50 bg-white focus:border-brand-yellow outline-none transition-all shadow-sm focus:shadow-xl font-medium text-brand-charcoal"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-neutral/40 group-focus-within:text-brand-yellow transition-colors" />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((product, index) => (
                    <ProductCard
                        key={`${product.SKU}-${index}`}
                        product={product}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-brand-sand/50 shadow-inner">
                    <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-brand-yellow" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-charcoal mb-2">No matches found</h3>
                    <p className="text-brand-gray-neutral font-medium">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}
