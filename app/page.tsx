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

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      <RetailHeader />

      {/* ── SPRING HOME REFRESH BANNER ── */}
      <SpringBanner />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── CONSOLIDATED 3D HERO SECTION ── */}
        <section className="pt-32 pb-24 md:pt-40 lg:pt-48 w-full block">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center w-full">

            {/* LEFT SIDE: Brand Narrative - 30% */}
            <div className="w-full lg:w-[30%] space-y-10 relative animate-in slide-in-from-left duration-1000 pl-4 lg:pl-0">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-brand-green/5 px-6 py-3 rounded-full border border-brand-green/10 mb-8 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-green/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                  <span className="text-[10px] md:text-[11px] font-black text-brand-green uppercase tracking-[0.2em] relative z-10 leading-tight animate-pulse">
                    Powered by 3D and realtime Spatial Technology
                  </span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-[5rem] xl:text-[5.5rem] font-black tracking-tighter leading-[1.1] pr-4" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>
                    <span className="block mb-1" style={{ color: '#FFFFFF' }}>Beautiful <span style={{ color: '#D4AF37' }}>Living.</span></span>
                    <span className="block" style={{ color: '#7FBF7A' }}>Smart Spring Savings.</span>
                  </h1>
                  <p className="text-lg md:text-xl font-bold max-w-md leading-relaxed" style={{ color: '#F8F8F8', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.2)' }}>
                    Discover stylish furniture and reliable appliances designed for modern homes &mdash; now available at <span style={{ color: '#D4AF37', fontWeight: 900 }}>exclusive seasonal prices.</span>
                  </p>
                  <p className="text-[12px] font-black uppercase tracking-[0.2em] pt-2" style={{ color: '#90EE90', textShadow: '0 3px 8px rgba(0,0,0,0.6)' }}>
                    Shop smarter &middot; Explore in 360 &middot; Visualize in your space &middot; precision shopping without doubts
                  </p>
                </div>
                
              </div>
            </div>

            {/* RIGHT SIDE: 3D Product Visualization - 70% */}
            <div className="flex flex-col items-center w-full lg:w-[70%]">
              {/* Product Viewer Container - NO FLAT IMAGES */}
              <div className="relative w-full aspect-[4/3] lg:aspect-[16/9] lg:min-h-[600px] xl:min-h-[700px] bg-[#FBFBFB] rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden group animate-in zoom-in duration-1000">

                {/* Soft Gradient Overlay for Premium Showroom Feel */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-black/5 pointer-events-none z-10 mix-blend-overlay" />
                
                {/* Scale Verification Badge */}
                <div className="absolute bottom-10 left-10 z-[60] animate-in slide-in-from-bottom duration-1000 delay-500">
                    <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] pointer-events-none group/badge transition-all hover:scale-105">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-brand-charcoal uppercase tracking-[0.2em] leading-tight">Scale Verified</span>
                            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">True-to-Life Size</span>
                        </div>
                    </div>
                </div>

                {heroProduct?.modelPath ? (
                  <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10">
                    <DynamicModelViewer
                      src={heroProduct.modelPath}
                      alt="Hero Product Visualization"
                      cameraControls={true}
                      autoRotate={true}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium relative z-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-red/10 border-t-brand-red rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Initializing Spatial View...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hero CTAs moved below the viewer */}
              <div className="w-full mt-10 max-w-2xl px-4 lg:px-0">
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

        {/* ── DEAL SECTIONS ── */}
        <HotSummerDeals products={products} />
      </div>
    </main>
  );
}



