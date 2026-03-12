'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import { getProducts } from '@/lib/products';
import RetailHeader from '@/components/RetailHeader';
import Footer from '@/components/Footer';
import HotSummerDeals from '@/components/HotSummerDeals';
import DynamicModelViewer from '@/components/DynamicModelViewer';
import HeroCTAs from '@/components/HeroCTAs';
import SpringBanner from '@/components/SpringBanner';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] =  useState<any[]>([]);
  const [heroProduct, setHeroProduct] = useState<any>(null);

  // Robust fix for auto-scroll to footer issue
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setProducts(data);
      setHeroProduct(data.find(p => p.SKU === '251024') || data[0]);
    }
    loadData();
  }, []);

  // Triggering fresh production deployment after optimization phase...

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      <RetailHeader />

      {/* ── SPRING HOME REFRESH BANNER ── */}
      <SpringBanner />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── POWERED BY BRANDING: Top Positioned ── */}
        <div className="pt-24 md:pt-32 flex justify-center w-full mb-8">
          <div className="inline-flex items-center gap-3 bg-brand-green/5 px-8 py-4 rounded-full border border-brand-green/10 overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-green/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-[10px] md:text-[12px] font-black text-brand-red uppercase tracking-[0.25em] relative z-10 leading-tight">
              Powered by 3D and realtime Spatial Technology
            </span>
          </div>
        </div>

        {/* ── CONSOLIDATED 3D HERO SECTION ── */}
        <section className="pb-24 w-full block">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center w-full">

            {/* LEFT SIDE: Brand Narrative - 30% */}
            <div className="w-full lg:w-max space-y-12 relative animate-in slide-in-from-left duration-1000 pl-4 lg:pl-0 order-1 lg:order-1">
              <div className="relative z-10 max-w-[520px]">
                <div className="space-y-10">
                  <h1 className="text-6xl lg:text-[6.5rem] font-bold tracking-tighter leading-[0.9] text-gray-900 uppercase font-playfair">
                    Modern <br />Living <span className="text-brand-green font-normal">Starts Here</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-500 font-inter">
                    Discover premium furniture designed for the modern lifestyle. Explore our spatial catalogue and visualize pieces in your own space before you buy.
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green/60">
                    See it in 3D. Place it in your space. Shop with confidence.
                  </p>
                </div>
                
                {/* Hero CTAs below text on mobile, or in 30% col on desktop */}
                <div className="mt-12 hidden lg:block">
                  <HeroCTAs sku={heroProduct?.SKU || '251024'} />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: 3D Product Visualization - 70% */}
            <div className="flex flex-col items-center w-full lg:w-grow order-2 lg:order-2 px-0 lg:px-4">
              <div className="relative w-[calc(100%+3rem)] mx-[-1.5rem] lg:w-full h-[80vh] lg:h-auto lg:aspect-[16/9] bg-gradient-to-br from-[#FAFAFA] to-[#F1F1F1] rounded-none lg:rounded-[3rem] border-y lg:border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden group">
                
                {heroProduct?.modelPath ? (
                  <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 p-0 md:p-24">
                    <DynamicModelViewer
                      src={heroProduct.modelPath}
                      alt="Hero Product Visualization"
                      cameraControls={true}
                      autoRotate={true}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200 font-medium relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest">Initializing Spatial View...</span>
                  </div>
                )}
              </div>

              {/* Hero CTAs moved below the viewer for mobile specifically, 
                  while desktop has them in the 30% text col */}
              <div className="w-full mt-10 lg:hidden px-4">
                 <HeroCTAs sku={heroProduct?.SKU || '251024'} />
              </div>
            </div>

          </div>
        </section>
        {/* ── TECHNOLOGY DIFFERENTIATION SECTION ── */}
        <section className="py-12 border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { title: 'Smart Browsing', icon: '🔍' },
                { title: 'Interactive Catalog', icon: '✨' },
                { title: 'Showroom Availability', icon: '🏬' },
                { title: 'Curated Collections', icon: '🛋️' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="text-3xl p-4 bg-gray-50 rounded-2xl mb-2">{item.icon}</span>
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORY NAVIGATION GRID ── */}
        <section className="py-24 animate-in fade-in duration-1000 delay-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Living Room', cat: 'SOFAS', color: 'bg-brand-green/10' },
              { name: 'Bedroom', cat: 'BEDS', color: 'bg-brand-red/5' },
              { name: 'Dining', cat: 'DINING', color: 'bg-gray-100' },
              { name: 'Appliances', cat: 'ELECTRONICS', color: 'bg-brand-green/5' }
            ].map((category) => (
              <a 
                key={category.name} 
                href={`/catalogue?category=${category.cat}`} 
                className={`group relative aspect-square rounded-[2.5rem] overflow-hidden ${category.color} border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-3`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-gray-900 group-hover:text-white text-2xl font-bold uppercase tracking-tighter leading-none transition-colors duration-300">{category.name}</p>
                  <p className="text-[10px] text-gray-400 group-hover:text-white/60 font-black uppercase tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">Shop Collection</p>
                </div>
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── DEAL SECTIONS ── */}
        <HotSummerDeals products={products} />
      </div>
    </main>
  );
}



