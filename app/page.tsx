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
    <main className="min-h-screen bg-white font-sans overflow-x-hidden pt-24">
      <RetailHeader />



      <div className="max-w-7xl mx-auto px-6">


        {/* ── CONSOLIDATED 3D HERO SECTION ── */}
        <section className="pb-24 w-full block">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-start w-full">

            {/* LEFT SIDE: Brand Narrative - 35% */}
            <div className="w-full lg:w-[35%] space-y-12 relative animate-in slide-in-from-left duration-1000 pl-4 lg:pl-0 order-1 lg:order-1">
              <div className="relative z-10 w-full max-w-[520px]">
                <div className="space-y-10">
                  <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900 uppercase font-playfair">
                    Modern <br />Living <span className="text-brand-green font-normal">Starts Here</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-500 font-inter">
                    Discover premium furniture designed for the modern lifestyle. Explore our spatial catalogue and visualize pieces in your own space before you buy.
                  </p>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFE926]">
                    See it in 3D. Place it in your space. Shop with confidence.
                  </p>
                </div>
                
                {/* Hero CTAs below text on mobile, or in 35% col on desktop */}
                <div className="mt-12 hidden lg:block">
                  <HeroCTAs sku={heroProduct?.SKU || '251024'} />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: 3D Product Visualization - 65% */}
            <div className="flex flex-col items-center w-full lg:w-[65%] order-2 lg:order-2 px-0 lg:px-4">
              <div className="relative w-full h-[85vh] lg:h-[620px] bg-gradient-to-br from-[#FAFAFA] to-[#F1F1F1] rounded-none lg:rounded-[3rem] border-y lg:border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden group">
                
                {heroProduct?.modelPath ? (
                  <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 p-4">
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




        {/* ── DEAL SECTIONS ── */}
        <HotSummerDeals products={products} />
      </div>
    </main>
  );
}



