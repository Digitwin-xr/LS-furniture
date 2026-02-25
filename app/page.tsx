import { getProducts } from '@/lib/products';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, Box, ShieldCheck, Zap, Star, TrendingUp, Flame, Camera, Scan } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { getClientConfig } from '@/engine/config/client-config';

export default async function Home() {
  const products = await getProducts();
  const config = getClientConfig();

  // Find a hero product (preferably one with a model)
  const heroProduct = products.find(p => p["Product Name"]?.toUpperCase().includes("SOFA SINGLE 3DIV SQUARE ARM MA") && p.hasModel) || products.find(p => p.hasModel) || products[0];

  // Featured products for carousel
  const featuredProducts = products.filter(p => p.hasModel).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-0 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <HeroSection heroProduct={heroProduct} />

      {/* ═══ HOW IT WORKS (3-Step Process) ═══ */}
      <section className="py-12 bg-white relative z-20 border-b border-brand-sand/30 shadow-sm mt-8 mx-6 rounded-[30px]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-brand-green-deep uppercase tracking-tighter italic leading-[0.9]">
              How It <span className="text-brand-yellow-warm mix-blend-multiply">Works.</span>
            </h2>
            <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Box}
              title="1. Browse in 3D"
              desc="Explore every detail in 360° before you commit."
              accent="bg-[#3D4451]"
            />
            <FeatureCard
              icon={Scan}
              title="2. Place in Your Space"
              desc="Use our spatial technology to see it true-to-scale in your room."
              accent="bg-brand-red"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="3. Buy with Confidence"
              desc="Eliminate guesswork and shop with complete spatial confidence."
              accent="bg-brand-green"
            />
          </div>
        </div>
      </section>


      {/* ═══ TRENDING PRODUCTS — Red + Yellow Summer Energy ═══ */}
      <section className="py-8 relative overflow-hidden">
        {/* Yellow background glow */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 animate-in slide-in-from-bottom duration-700">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-red font-black text-[10px] uppercase tracking-[0.5em] mb-4">
                <Flame className="w-4 h-4 text-brand-red" />
                Trending This Season
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-brand-green-deep uppercase tracking-tighter italic leading-[0.9]">
                {config.marketing.hotSummerSaleLabel.split(' ').slice(0, 2).join(' ')} <span className="text-brand-red">{config.marketing.hotSummerSaleLabel.split(' ').slice(2).join(' ')}.</span>
              </h2>
              <div className="h-1 w-24 bg-brand-yellow rounded-full mt-4" />
            </div>
            <Link href="/catalogue" className="flex items-center gap-4 text-brand-red font-bold uppercase tracking-[0.3em] hover:text-brand-red-deep transition-all group pb-4 border-b-2 border-brand-yellow hover:border-brand-red text-[11px]">
              Explore Full Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p, idx) => (
              <div key={p.SKU} className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ SHOWROOM CATEGORIES — Red hover, yellow markers ═══ */}
      <section className="py-12 max-w-7xl mx-auto px-6 mb-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-brand-red rounded-full" />
            <span className="text-brand-red font-black text-[10px] uppercase tracking-[0.5em]">{config.marketing.hotSummerSaleLabel}</span>
            <div className="h-1 w-12 bg-brand-red rounded-full" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-brand-green-deep uppercase tracking-tighter italic leading-[0.9] mb-6">
            {config.shortName} <span className="text-brand-red">Furniture.</span>
          </h2>
          <p className="text-brand-gray-neutral font-medium tracking-wide text-sm">{config.marketing.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Sofas', sub: 'Comfort Meets Modern Living' },
            { name: 'Electronics', sub: 'Smart Technology for Everyday Homes' },
            { name: 'Beds', sub: 'Sleep Better. Live Better.' },
            { name: 'Kitchen', sub: 'Upgrade the Heart of Your Home' }
          ].map((cat, idx) => (
            <CategoryCard key={cat.name} name={cat.name} subtext={cat.sub} delay={idx * 100} />
          ))}
        </div>
      </section>

      {/* ═══ TECHNOLOGY POSITIONING ═══ */}
      <section className="py-12 max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-brand-sand shadow-premium text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black text-brand-green-deep tracking-tighter mb-3 italic">Next-Generation Furniture Shopping</h2>
          <p className="text-base font-bold text-brand-charcoal mb-8 uppercase tracking-widest italic">POWERED BY SPATIAL TECHNOLOGY.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-brand-gray-neutral font-medium text-left max-w-3xl">
            <li className="flex items-center gap-3"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div></div> 360° interactive viewing</li>
            <li className="flex items-center gap-3"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div></div> True-to-scale spatial placement</li>
            <li className="flex items-center gap-3"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-green-deep"></div></div> Eliminate spatial guesswork</li>
            <li className="flex items-center gap-3"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div></div> Shop with absolute confidence</li>
          </ul>
          <p className="text-lg font-black text-brand-charcoal tracking-wide border-t border-brand-sand/50 pt-6 inline-block">No guesswork. No surprises. Just smarter shopping.</p>
        </div>
      </section>

      {/* ═══ LIFESTYLE & AFFORDABILITY ═══ */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 mb-10">
        <div className="bg-brand-green-deep rounded-[3rem] text-white overflow-hidden relative p-8 md:p-14 shadow-2xl border-4 border-brand-yellow/10">
          <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-brand-red/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 italic uppercase leading-[0.9] text-center">
              Designed for Real Homes.<br />
              <span className="text-brand-yellow">Priced for Real Families.</span>
            </h2>

            <p className="text-base text-white/80 font-medium mb-10 tracking-wide text-center">
              At {config.name}, we combine:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {config.marketing.valueProps.map((prop, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-full flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${idx % 2 === 0 ? 'bg-brand-red' : 'bg-brand-yellow text-brand-charcoal'} flex items-center justify-center font-black italic shadow-lg`}>0{idx + 1}</div>
                  <span className="font-bold text-sm tracking-wide uppercase">{prop}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-full py-4 px-10 border border-white/20 inline-block">
                <p className="text-sm md:text-base text-brand-yellow font-black uppercase tracking-[0.3em]">
                  Because great homes should be stylish — not stressful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function CategoryCard({ name, subtext, delay }: { name: string, subtext: string, delay: number }) {
  return (
    <Link
      href={`/catalogue?category=${name}`}
      className="group relative h-[180px] rounded-2xl overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom duration-1000 border border-brand-sand/10"
      style={{ animationDelay: `${delay}ms`, background: 'linear-gradient(160deg, #3A7D44, #2a5c32)' }}
    >
      {/* Red hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-red/0 group-hover:to-brand-red/60 transition-all duration-700" />
      <div className="absolute top-8 left-8">
        <div className="w-12 h-12 bg-brand-yellow/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 border border-brand-yellow/20">
          <ArrowRight className="w-6 h-6 text-brand-yellow group-hover:text-white transition-colors" />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 transform group-hover:translate-y-[-4px] transition-transform duration-500">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[2px] w-4 bg-brand-yellow group-hover:w-8 transition-all duration-500" />
          <span className="text-[8px] font-black text-brand-yellow uppercase tracking-[0.3em]">Collection</span>
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md mb-1 leading-none">{name}</h3>
        <p className="text-[9px] font-bold text-white/70 group-hover:text-brand-yellow uppercase tracking-[0.1em] transition-all duration-500 line-clamp-1">
          {subtext}
        </p>
      </div>
    </Link>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }: { icon: any, title: string, desc: string, accent: string }) {
  return (
    <div className="bg-white p-6 rounded-[40px] border border-brand-sand shadow-sm group hover:shadow-md transition-all duration-300 flex flex-col justify-center text-center items-center">
      <div className={`w-10 h-10 flex-shrink-0 ${accent} rounded-[14px] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-all duration-300`}>
        <Icon className="w-5 h-5 text-white/90" strokeWidth={2.5} />
      </div>
      <h3 className="text-[14px] font-black text-brand-charcoal tracking-widest uppercase mb-2 italic">{title}</h3>
      <p className="text-brand-gray-neutral leading-relaxed font-medium text-[11px]">{desc}</p>
    </div>
  );
}
