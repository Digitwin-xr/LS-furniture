'use client';

import { Facebook, Instagram, Mail, Phone, MapPin, Send, MessageCircle, Video } from 'lucide-react';
import { useClient } from '@/engine/context/ClientContext';
import Link from 'next/link';

import OurShowrooms from './OurShowrooms';

export default function Footer() {
    const config = useClient();
    const currentYear = new Date().getFullYear();

    return (
        <>
        <OurShowrooms />
        <footer className="bg-white border-t border-brand-sand/20 text-brand-charcoal pt-24 pb-12 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Stacked Layout */}
                <div className="flex flex-col items-center text-center gap-16 mb-20">
                    
                    {/* Brand Core */}
                    <div className="space-y-6 max-w-2xl">
                        <div className="flex flex-col items-center">
                            <h2 className="text-4xl md:text-5xl font-black text-brand-charcoal tracking-tight leading-none mb-3 font-serif uppercase">
                                LS Furniture & Appliances
                            </h2>
                        </div>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
                            Stylish furniture and reliable home appliances designed for modern living &mdash; bringing comfort, quality, and value to every home.
                        </p>
                    </div>

                    {/* Main Nav & Showrooms Combo */}
                    <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-32 w-full pt-8">
                        {/* Essential Links */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h5 className="text-[11px] font-black text-brand-charcoal uppercase tracking-widest mb-2">Explore</h5>
                            <Link href="/catalogue" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors duration-200">Browse Products</Link>
                            <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors duration-200">About LS</Link>
                            <Link href="/contact" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors duration-200">Contact</Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h5 className="text-[11px] font-black text-brand-charcoal uppercase tracking-widest mb-2">Why Choose LS</h5>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                <span className="text-brand-green">✓</span> Quality craftsmanship
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                <span className="text-brand-green">✓</span> Affordable pricing
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                <span className="text-brand-green">✓</span> Local showroom support
                            </div>
                        </div>
                    </div>

                    {/* Social Circle */}
                    <div className="flex items-center gap-6 pt-10">
                        {[
                            { icon: Facebook, href: config.social.facebook },
                            { icon: Instagram, href: config.social.instagram },
                            { icon: MessageCircle, href: config.social.whatsapp },
                            { icon: Video, href: config.social.tiktok }
                        ].map((social, idx) => (
                            <a 
                                key={idx}
                                href={social.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-200"
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="pt-12 border-t border-brand-sand/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-[10px] font-black text-brand-charcoal/30 uppercase tracking-[0.4em]">
                            &copy; {currentYear} {config.name}. Built for Botswana.
                        </p>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.3em] italic">Spatial Hub Online</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimalist bg accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-sand/50 to-transparent" />
        </footer>
        </>
    );
}
