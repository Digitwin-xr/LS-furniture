'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Home, Grid, Heart, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useClient } from '@/engine/context/ClientContext';

function MobileNavLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive ? 'text-brand-red bg-brand-red/5' : 'text-brand-gray-neutral hover:text-brand-red'
            }`}>
            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
        </Link>
    );
}

export default function Navbar() {
    const config = useClient();

    return (
        <>
            {/* Desktop / Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-brand-sand/20">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

                    {/* Logo Anchor — Diamond LS Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 flex items-center justify-center bg-brand-red rounded-lg shadow-lg group-hover:scale-110 transition-transform rotate-45 shadow-brand-red/20 origin-center animate-in zoom-in duration-700">
                                <span className="text-xl font-black text-white tracking-tighter italic -rotate-45">LS</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-brand-charcoal tracking-[0.2em] uppercase leading-none">{config.shortName}</span>
                                <span className="text-[8px] font-black text-brand-green uppercase tracking-[0.4em] leading-none mt-1 italic">Spatial Retail Hub</span>
                            </div>
                        </Link>
                    </div>

                    {/* Compressed Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <NavLink href="/" label="Home" />
                        <NavLink href="/catalogue" label="Collection" />
                        <NavLink href="/contact" label="Contact Us" />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-3">
                        <button className="p-2 text-brand-charcoal/40 hover:text-brand-red transition-all rounded-xl">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-brand-charcoal/40 hover:text-brand-red transition-all rounded-xl relative group">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full shadow-sm"></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-2xl border border-brand-sand/50 rounded-3xl z-[100] shadow-2xl px-4 overflow-hidden">
                <div className="flex justify-around items-center h-16">
                    <MobileNavLink href="/" icon={Home} label="Home" />
                    <MobileNavLink href="/catalogue" icon={Grid} label="Shop" />
                    <MobileNavLink href="/favorites" icon={Heart} label="Saved" />
                    <MobileNavLink href="/contact" icon={Mail} label="Contact" />
                </div>
            </div>
        </>
    );
}

function NavLink({ href, label }: { href: string, label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all relative py-2 italic ${isActive ? 'text-brand-red' : 'text-brand-charcoal/40 hover:text-brand-red'
                }`}
        >
            {label}
            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-red rounded-full" />
            )}
        </Link>
    );
}
