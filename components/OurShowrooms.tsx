'use client';

import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export default function OurShowrooms() {
    return (
        <section className="py-16 bg-white shrink-0 pb-12 w-full mt-24">
            <div className="max-w-[1400px] mx-auto px-6">
                <h2 className="font-serif font-bold text-xl mb-10 text-gray-900 uppercase">
                    OUR SHOWROOMS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mogoditshane */}
                    <div className="bg-[#f8f8f8] rounded-2xl p-8 flex flex-col gap-4">
                        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-[15px]">
                            <MapPin className="text-[#E51A22] w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                            Mogoditshane LS Lifestyle
                        </h3>
                        <p className="text-gray-500 text-[13px] leading-relaxed">
                            Plot 1234, Mogoditshane Village,<br />Opposite Super Save Mall
                        </p>
                        <a href="#" className="text-[#E51A22] flex items-center gap-2 text-[13px] font-bold mt-2 hover:underline">
                            <span className="w-4 h-4 rounded border border-[#E51A22] flex items-center justify-center mr-1">
                                <span className="w-1.5 h-1.5 bg-[#E51A22] rounded-sm transform rotate-45"></span>
                            </span>
                            Get Directions
                        </a>
                        <div className="text-gray-600 font-medium text-[13px] flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> +267 3960067
                        </div>
                    </div>

                    {/* Tlokweng */}
                    <div className="bg-[#f8f8f8] rounded-2xl p-8 flex flex-col gap-4">
                        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-[15px]">
                            <MapPin className="text-[#E51A22] w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                            Tlokweng LS Lifestyle
                        </h3>
                        <p className="text-gray-500 text-[13px] leading-relaxed">
                            Plot 5682, Tlokweng Road, Behind FNB
                        </p>
                        <a href="#" className="text-[#E51A22] flex items-center gap-2 text-[13px] font-bold mt-2 hover:underline">
                            <span className="w-4 h-4 rounded border border-[#E51A22] flex items-center justify-center mr-1">
                                <span className="w-1.5 h-1.5 bg-[#E51A22] rounded-sm transform rotate-45"></span>
                            </span>
                            Get Directions
                        </a>
                        <div className="text-gray-600 font-medium text-[13px] flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> +267 3960251
                        </div>
                    </div>

                    {/* Broadhurst */}
                    <div className="bg-[#f8f8f8] rounded-2xl p-8 flex flex-col gap-4">
                        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-[15px]">
                            <MapPin className="text-[#E51A22] w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                            Broadhurst LS Lifestyle
                        </h3>
                        <p className="text-gray-500 text-[13px] leading-relaxed">
                            Plot 789, Legolo Road, Broadhurst<br />Industrial
                        </p>
                        <a href="#" className="text-[#E51A22] flex items-center gap-2 text-[13px] font-bold mt-2 hover:underline">
                            <span className="w-4 h-4 rounded border border-[#E51A22] flex items-center justify-center mr-1">
                                <span className="w-1.5 h-1.5 bg-[#E51A22] rounded-sm transform rotate-45"></span>
                            </span>
                            Get Directions
                        </a>
                        <div className="text-gray-600 font-medium text-[13px] flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> +267 3182011
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
