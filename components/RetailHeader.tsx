'use client';

import Link from 'next/link';
import { Heart, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function RetailHeader() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-50">
            <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">

                {/* Left: Logo Section */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-brand-red transform rotate-45 flex items-center justify-center rounded-sm shadow-sm hover:scale-105 transition-transform">
                        <span className="text-white font-black tracking-widest text-lg transform -rotate-45 block pt-1 ml-1 leading-none">LS</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif font-bold text-xl text-gray-900 tracking-tight leading-none mb-1">
                            LIFESTYLE
                        </span>
                        <span className="text-[11px] text-brand-green font-bold uppercase tracking-widest leading-none">
                            Furniture & Appliances
                        </span>
                    </div>
                </Link>

                {/* Center: Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/catalogue" className={`text-[13px] font-black tracking-widest uppercase transition-colors hover:text-brand-green ${pathname === '/catalogue' ? 'text-brand-green' : 'text-gray-600'}`}>SHOP</Link>
                    <Link href="/contact" className={`text-[13px] font-black tracking-widest uppercase transition-colors hover:text-brand-green ${pathname === '/contact' ? 'text-brand-green' : 'text-gray-600'}`}>CONTACT US</Link>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-brand-green transition-colors p-2">
                        <Heart className="w-5 h-5 stroke-[1.5]" />
                    </button>
                </div>

            </div>
        </header>
    );
}
