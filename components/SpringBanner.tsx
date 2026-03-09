'use client';

import React from 'react';
import Link from 'next/link';

export default function SpringBanner() {
    return (
        <div
            className="w-full flex items-center justify-between gap-3 px-5 text-white"
            style={{
                background: '#7F9B7A',
                minHeight: '40px',
                borderRadius: '0',
                padding: '0 20px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
            }}
        >
            {/* Left: Indicator + Message */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Static indicator */}
                <div className="w-2 h-2 rounded-full bg-white opacity-40 shrink-0" />
                <span className="font-semibold tracking-wide">
                    🌿 Spring Home Refresh
                </span>
                <span className="hidden sm:inline opacity-80 text-[13px]">
                    — Limited Seasonal Savings on Furniture &amp; Appliances
                </span>
                <span className="hidden lg:inline opacity-70 text-[12px]">
                    · Upgrade your space with stylish furniture and reliable appliances at exceptional spring prices.
                </span>
            </div>

            {/* Right: Shop Spring Deals CTA */}
            <Link
                href="/catalogue?deals=true"
                className="shrink-0 ml-4 px-4 py-1.5 text-[12px] font-black tracking-widest uppercase rounded-md transition-all duration-200"
                style={{
                    background: '#FFFFFF',
                    color: '#3D4451',
                    border: '2px solid transparent',
                }}
            >
                Shop Spring Deals
            </Link>
        </div>
    );
}
