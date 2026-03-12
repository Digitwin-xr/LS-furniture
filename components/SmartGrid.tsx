// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';
import { Search, ArrowUpRight, FilterX, LayoutGrid, List } from 'lucide-react';

const ORDERED_CATEGORIES = ['SOFAS', 'CHAIRS', 'BEDS', 'WARDROBES', 'STORAGE', 'TV UNITS', 'DINING', 'TABLES & DESKS', 'KITCHEN', 'ELECTRONICS'];

interface SmartGridProps {
  products: any[];
  categories: string[];
  initialCategory?: string;
}

export default function SmartGrid({ products, categories, initialCategory }: SmartGridProps) {
  // Scroll Restoration Logic
  useEffect(() => {
    const savedState = sessionStorage.getItem('ls_catalogue_state');
    if (savedState) {
      const { category, scrollY } = JSON.parse(savedState);
      setActiveCategory(category);
      
      // Delay scroll to ensure grid has rendered
      const timeout = setTimeout(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
        sessionStorage.removeItem('ls_catalogue_state');
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Sync category to state (without scroll pos, that happens on click)
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    // When manually changing category, we should reset any pending restoration
    sessionStorage.removeItem('ls_catalogue_state');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = p.Category === activeCategory;
      const matchesSearch = !searchQuery ||
        p["Product Name"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.Description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-0">

      {/* ═══ LEFT SIDEBAR: Categories + Search ═══ */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-[80px] self-start h-[calc(100vh-80px)] border-r border-gray-100 bg-white pr-4 pt-4 pb-6">

        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-300 mb-4 pl-2">Categories</p>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {ORDERED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                activeCategory === cat
                  ? "bg-brand-green text-white shadow-md shadow-brand-green/20"
                  : "text-brand-charcoal/50 hover:bg-gray-50 hover:text-brand-charcoal"
              )}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Search pinned to bottom of sidebar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-charcoal/30" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-brand-charcoal placeholder:text-brand-charcoal/20 focus:border-brand-green focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
      </aside>

      {/* Mobile Category Row */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-3 px-4 sticky top-[96px] z-40 bg-white border-b border-gray-100 w-full no-scrollbar">
        {ORDERED_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              activeCategory === cat
                ? "bg-brand-green text-white shadow-md"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ═══ RIGHT: PRODUCT GRID ═══ */}
      <div className="flex-1 min-w-0 pl-0 md:pl-8 pt-4">

        {/* Category Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 uppercase tracking-tighter font-playfair">{activeCategory}</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2 font-inter">{filteredProducts.length} pieces in collection</p>
          </div>
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-brand-red hover:border-brand-red/20 transition-all"
          >
            {isCompact ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold placeholder:text-gray-300 focus:border-brand-green focus:bg-white transition-all outline-none"
          />
        </div>

        {filteredProducts.length > 0 ? (
          <div className={cn(
            "grid gap-4 md:gap-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-500",
            isCompact
              ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {filteredProducts.map((product, idx) => (
              <div
                key={product.SKU}
                className="transition-opacity duration-300"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-brand-sand/30 rounded-[30px] flex items-center justify-center mb-6">
              <FilterX className="w-10 h-10 text-brand-charcoal/20" />
            </div>
            <h3 className="text-2xl font-black text-brand-charcoal uppercase tracking-tighter italic mb-2">No Matches Found</h3>
            <p className="text-brand-gray-neutral text-sm font-medium">Try adjusting your search terms.</p>
          </div>
        )}

        {/* Footer Brand Strip */}
        <div className="w-full bg-brand-charcoal py-4 overflow-hidden mb-12 rounded-2xl">
          <div className="flex whitespace-nowrap md:animate-marquee">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Premium Spatial Experience</span>
                <ArrowUpRight className="w-4 h-4 text-brand-yellow/20" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">LS Furniture Botswana</span>
                <ArrowUpRight className="w-4 h-4 text-brand-red/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
