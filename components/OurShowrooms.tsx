'use client';

import React from 'react';
import { MapPin, Phone, Navigation } from 'lucide-react';

const SHOWROOMS = [
    {
        location: "Mogoditshane",
        address: "Plot 1234, Village Square, Opposite Super Save Mall",
        phone: "+267 3960067",
        mapLink: "https://maps.google.com/?q=LS+Furniture+Mogoditshane"
    },
    {
        location: "Tlokweng",
        address: "Plot 5682, Tlokweng Road, Behind FNB",
        phone: "+267 3960251",
        mapLink: "https://maps.google.com/?q=LS+Furniture+Tlokweng"
    },
    {
        location: "Broadhurst",
        address: "Plot 789, Legolo Road, Industrial Area",
        phone: "+267 3182011",
        mapLink: "https://maps.google.com/?q=LS+Furniture+Broadhurst"
    }
];

export default function OurShowrooms() {
    return (
        <section className="py-20 bg-[#FBFBFB] border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-[11px] font-black text-brand-green uppercase tracking-[0.4em] mb-4">Visit Us Today</h2>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Our Showrooms</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SHOWROOMS.map((showroom, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="w-12 h-12 rounded-2xl bg-brand-green/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <MapPin className="text-brand-green w-6 h-6" />
                            </div>
                            
                            <h4 className="text-xl font-serif font-bold mb-4 flex flex-wrap items-center gap-x-2">
                                <span className="text-brand-red">LS</span>
                                <span className="text-brand-green">Furniture and appliances</span>
                                <span className="text-gray-900 block w-full mt-1 text-sm uppercase tracking-widest">{showroom.location}</span>
                            </h4>

                            <div className="space-y-4 mb-10">
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {showroom.address}
                                </p>
                                <div className="flex items-center gap-3 text-brand-charcoal font-black text-xs tracking-widest">
                                    <Phone className="w-4 h-4 text-brand-green" />
                                    {showroom.phone}
                                </div>
                            </div>

                            <a 
                                href={showroom.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[10px] font-black text-brand-green uppercase tracking-widest group/btn"
                            >
                                <span className="w-8 h-8 rounded-full border border-brand-green/20 flex items-center justify-center group-hover/btn:bg-brand-green group-hover/btn:text-white transition-all">
                                    <Navigation className="w-3.5 h-3.5" />
                                </span>
                                Get Directions
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
