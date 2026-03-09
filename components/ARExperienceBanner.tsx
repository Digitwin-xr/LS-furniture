'use client';

import { Camera, Move3d, Navigation, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ARExperienceBanner() {
    return (
        <section id="ar-experience" className="py-32 relative bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(166,192,101,0.08)_0%,transparent_50%)]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(229,26,34,0.03)_0%,transparent_50%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 lg:gap-32 items-center relative z-10">

                {/* Content Side */}
                <div className="space-y-12 text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-brand-green/5 px-4 py-2 rounded-full border border-brand-green/10">
                            <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Advanced Spatial Computing</span>
                        </div>
                        <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter font-playfair leading-[0.9] text-brand-charcoal">
                            SEE IT IN <br /><span className="text-brand-red">YOUR SPACE.</span>
                        </h3>
                    </div>

                    <p className="text-brand-gray-neutral font-medium text-xl leading-snug max-w-lg">
                        Instantly place true-to-scale 3D models into your home using augmented reality. Perfect fit, verified by tech.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-10 pt-4">
                        <div className="group relative bg-white/40 backdrop-blur-2xl border border-white/60 p-10 rounded-[4rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center">
                             <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-8 group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-500 shadow-inner">
                                <Move3d className="w-8 h-8" />
                            </div>
                            <h4 className="font-black text-[12px] tracking-[0.2em] uppercase text-brand-charcoal mb-4">Precision Scale</h4>
                            <p className="text-brand-gray-neutral leading-relaxed text-[11px] font-medium uppercase tracking-widest opacity-80">Verified 1:1 dimensions for a guaranteed fit.</p>
                        </div>
                        <div className="group relative bg-white/40 backdrop-blur-2xl border border-white/60 p-10 rounded-[4rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center">
                             <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-8 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-inner">
                                <Smartphone className="w-8 h-8" />
                            </div>
                            <h4 className="font-black text-[12px] tracking-[0.2em] uppercase text-brand-charcoal mb-4">Instant Access</h4>
                            <p className="text-brand-gray-neutral leading-relaxed text-[11px] font-medium uppercase tracking-widest opacity-80">Zero-install native AR for iOS & Android systems.</p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link
                            href="/catalogue"
                            className="inline-flex bg-brand-charcoal text-white py-6 px-12 rounded-2xl text-[12px] font-black tracking-widest items-center justify-center gap-4 shadow-2xl hover:bg-brand-red transition-all active:scale-95 group"
                        >
                            EXPLORE SPATIAL CATALOGUE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="relative aspect-square w-full max-w-lg mx-auto lg:max-w-none">
                    <div className="w-full h-full relative rounded-[4rem] bg-gradient-to-br from-brand-sand/30 to-white border border-brand-sand/20 overflow-hidden p-12 flex flex-col items-center justify-center shadow-inner">
                        <div className="relative w-full max-w-[320px] aspect-[9/19.5] rounded-[3.5rem] border-[10px] border-brand-charcoal shadow-2xl bg-white overflow-hidden flex items-center justify-center">
                            {/* Faux AR View */}
                            <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center">
                                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(166,192,101,0.1)_0%,transparent_70%)] animate-pulse" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                     <div className="scale-150 text-brand-green/20">
                                         <Move3d className="w-24 h-24 stroke-[1px]" />
                                     </div>
                                </div>
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest text-brand-charcoal/20 uppercase">Scanning Surface...</div>
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-100 border-t-2 border-t-brand-green">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal">JULIET_DAYBED_V1</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute top-12 -right-4 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 animate-float">
                            <Camera className="w-8 h-8 text-brand-red" />
                        </div>
                        <div className="absolute bottom-12 -left-4 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 animate-float" style={{ animationDelay: '1s' }}>
                            <Navigation className="w-8 h-8 text-brand-green" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

