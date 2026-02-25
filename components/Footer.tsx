'use client';

import { Facebook, Instagram, Mail, Phone, MapPin, Send, MessageCircle, Video } from 'lucide-react';
import { useClient } from '@/engine/context/ClientContext';

export default function Footer() {
    const config = useClient();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-sand/50 border-t border-brand-sand/30 text-brand-charcoal pt-12 pb-8 overflow-hidden relative">
            {/* Soft Gradient Backdrop */}
            <div className="absolute inset-0 summer-gradient opacity-40 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="flex flex-col">
                            <h2 className="text-4xl font-black text-brand-green-deep tracking-tighter italic leading-none mb-1">
                                {config.shortName}
                            </h2>
                            <h3 className="text-lg font-bold text-brand-charcoal uppercase tracking-[0.2em] leading-none">
                                {config.name.split(' ').slice(2).join(' ')}
                            </h3>
                        </div>
                        <p className="text-brand-gray-neutral font-medium text-[13px] leading-relaxed max-w-xs">
                            {config.marketing.description}
                        </p>
                        <p className="text-brand-gray-neutral font-black uppercase text-[9px] tracking-[0.2em] italic opacity-60">
                            POWERED BY 3D AND REAL TIME SPATIAL TECHNOLOGY.
                        </p>

                        <div className="flex items-center gap-3">
                            <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white border border-brand-sand flex items-center justify-center hover:bg-brand-green-deep hover:text-white hover:scale-110 transition-all shadow-sm group">
                                <Facebook className="w-5 h-5 group-hover:animate-pulse" />
                            </a>
                            <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white border border-brand-sand flex items-center justify-center hover:bg-brand-green-deep hover:text-white hover:scale-110 transition-all shadow-sm group">
                                <Instagram className="w-5 h-5 group-hover:animate-pulse" />
                            </a>
                            <a href={config.social.tiktok} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white border border-brand-sand flex items-center justify-center hover:bg-brand-charcoal hover:text-white hover:scale-110 transition-all shadow-sm group">
                                <Video className="w-5 h-5 group-hover:animate-pulse" />
                            </a>
                            <a href={config.social.whatsapp} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white border border-brand-sand flex items-center justify-center hover:bg-brand-green hover:text-white hover:scale-110 transition-all shadow-sm group">
                                <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                            </a>
                        </div>
                    </div>

                    {/* Showrooms Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <h4 className="text-[10px] font-black text-brand-green-deep uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                            <div className="h-[2px] w-12 bg-brand-green" /> Showroom Locations
                        </h4>
                        <div className="grid sm:grid-cols-1 gap-4">
                            {config.showrooms.map((store) => (
                                <div
                                    key={store.name}
                                    className="group cursor-pointer p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-sand"
                                    onClick={() => window.open(store.mapUrl, '_blank')}
                                >
                                    <h5 className="text-lg font-bold text-brand-charcoal group-hover:text-brand-green-deep transition-colors flex items-center justify-between">
                                        {store.name}
                                        <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-brand-green" />
                                    </h5>
                                    <div className="flex items-start gap-3 mt-4 text-brand-gray-neutral">
                                        <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                                        <p className="text-sm font-medium leading-relaxed">
                                            {store.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 text-brand-gray-neutral">
                                        <Phone className="w-4 h-4 text-brand-green shrink-0" />
                                        <p className="text-sm font-bold text-brand-charcoal">{store.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-[10px] font-black text-brand-green-deep uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                            <div className="h-[2px] w-12 bg-brand-green" /> Quick Links
                        </h4>
                        <div className="flex flex-col gap-3">
                            <a href="/catalogue" className="text-xs font-bold text-brand-charcoal hover:text-brand-green-deep hover:translate-x-3 transition-all flex items-center gap-2">
                                🛋️ Explore Collection
                            </a>
                            <a href="/contact" className="text-xs font-bold text-brand-charcoal hover:text-brand-green-deep hover:translate-x-3 transition-all flex items-center gap-2">
                                📩 Get in Touch
                            </a>

                            <div className="pt-6">
                                <div className="p-4 rounded-xl bg-brand-green/5 border border-brand-green/10">
                                    <p className="text-[8px] font-bold text-brand-green-deep uppercase tracking-widest leading-none mb-1">Pricing Region</p>
                                    <p className="text-base font-bold text-brand-charcoal italic">Botswana (Pula P)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-8 border-t border-brand-sand flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-medium text-brand-gray-neutral uppercase tracking-[0.3em]">
                        &copy; {currentYear} {config.name}. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            <span className="text-[8px] font-bold text-brand-green uppercase tracking-widest">AR Hub Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
