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
            <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-brand-sand/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo — Configurable brand logo/short name */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-4 group">
                                <div className="w-12 h-12 flex items-center justify-center bg-brand-red rounded-xl shadow-sm group-hover:scale-110 transition-transform rotate-45">
                                    <span className="text-2xl font-black text-white tracking-tighter italic -rotate-45">{config.shortName.split(' ')[0]}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-brand-charcoal tracking-[0.2em] uppercase leading-none">{config.shortName}</span>
                                    <span className="text-[10px] font-bold text-brand-green uppercase tracking-[0.4em] leading-none mt-1">Modern Furniture & Spatial Tech</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-10">
                            <NavLink href="/" label="Home" />
                            <NavLink href="/catalogue" label="Collection" />
                            <NavLink href="/favorites" label="Saved" />
                            <NavLink href="/contact" label="Contact" />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <button className="p-3 text-brand-charcoal/40 hover:text-brand-red transition-all hover:bg-brand-red/5 rounded-2xl">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-3 text-brand-charcoal/40 hover:text-brand-red transition-all hover:bg-brand-red/5 rounded-2xl relative group">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full animate-bounce shadow-sm"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-brand-sand rounded-3xl z-[100] shadow-premium pb-safe px-4">
                <div className="flex justify-around items-center h-20">
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
            className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative py-2 ${isActive ? 'text-brand-red' : 'text-brand-charcoal/40 hover:text-brand-red'
                }`}
        >
            {label}
            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-yellow rounded-full animate-in zoom-in-y duration-300" />
            )}
        </Link>
    );
}
