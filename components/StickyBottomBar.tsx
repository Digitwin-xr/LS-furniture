'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid, Camera, Mail, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StickyBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Explore', icon: Home, href: '/' },
    { label: 'Shop', icon: Grid, href: '/catalogue' },
    { label: 'Spatial', icon: Camera, href: '/catalogue?filter=spatial' },
    { label: 'Contact', icon: Mail, href: '/contact' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-around h-20 px-4 ring-1 ring-black/5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300",
                isActive ? "text-brand-light-green bg-brand-light-green/5 scale-110" : "text-brand-gray-neutral hover:text-brand-charcoal"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className="text-[9px] font-black uppercase tracking-tighter italic">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-brand-light-green rounded-full shadow-[0_0_10px_#87C940]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
