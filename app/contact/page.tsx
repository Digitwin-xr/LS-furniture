'use client';

import dynamic from 'next/dynamic';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useClient } from '@/engine/context/ClientContext';

const DynamicRetailHeader = dynamic(() => import('@/components/RetailHeader'), { ssr: false });

export default function ContactPage() {
    const config = useClient();

    return (
        <main className="min-h-screen bg-white pb-24 font-sans">
            <DynamicRetailHeader />
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Info */}
                    <div className="space-y-12">
                        <div className="animate-in slide-in-from-left duration-1000">
                            <h1 className="text-5xl md:text-8xl font-black text-brand-red uppercase tracking-tighter mb-8 italic leading-[0.8] font-playfair">
                                Get in <br /><span className="text-brand-green not-italic">Touch.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-lg font-inter">
                                Have questions about our 3D catalogue, interior solutions, or specific pieces? Our consultants are ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-start gap-8 group">
                                <div className="w-14 h-14 bg-brand-green text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-brand-green/20 shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="space-y-6">
                                    {config.showrooms.map((showroom) => (
                                        <div key={showroom.name} className="border-l-2 border-gray-100 pl-4 md:pl-6 overflow-hidden">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{showroom.name}</p>
                                            <p className="text-base md:text-lg font-bold text-gray-900 leading-tight mb-2 uppercase tracking-tight">{showroom.address}</p>
                                            <p className="text-xl md:text-2xl font-black text-brand-green leading-none">{showroom.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:gap-8 group">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-red text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-brand-red/20 shrink-0">
                                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="border-l-2 border-gray-100 pl-4 md:pl-6 overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Email Enquiries</p>
                                    <p className="text-lg md:text-2xl font-black text-gray-900 leading-none break-all">sales@lslifestyle.co.bw</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50/50 rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-10">Send an Enquiry</h2>
                        <form className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Your Name</label>
                                <input type="text" className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-brand-green outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300" placeholder="FULL NAME" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Email Address</label>
                                <input type="email" className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-brand-green outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300" placeholder="EMAIL@EXAMPLE.COM" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Message</label>
                                <textarea rows={4} className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-brand-green outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300" placeholder="HOW CAN WE ASSIST YOU?"></textarea>
                            </div>
                            <button className="w-full bg-brand-green text-white py-5 rounded-2xl text-[12px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-brand-green-deep hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-brand-green/20 group">
                                <span>Send Enquiry</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
