'use client';

import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useClient } from '@/engine/context/ClientContext';

export default function ContactPage() {
    const config = useClient();

    return (
        <main className="min-h-screen bg-brand-sand/20 pb-24">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Info */}
                    <div>
                        <h1 className="text-5xl font-black text-brand-green-deep uppercase tracking-tighter mb-4 italic">
                            Get in <span className="text-brand-charcoal not-italic">Touch</span>
                        </h1>
                        <p className="text-lg text-brand-gray-neutral mb-12">
                            Have questions about our 3D catalogue or specific furniture pieces? Our design consultants are ready to assist.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="w-16 h-16 bg-brand-green text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shrink-0">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    {config.showrooms.map((showroom) => (
                                        <div key={showroom.name}>
                                            <p className="text-sm font-bold text-brand-gray-neutral uppercase tracking-widest mb-1">{showroom.name}</p>
                                            <p className="text-lg font-bold text-brand-charcoal leading-tight">{showroom.address}</p>
                                            <p className="text-xl font-black text-brand-green-deep">{showroom.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-brand-green-deep text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-brand-gray-neutral uppercase tracking-widest">Email Enquiries</p>
                                    <p className="text-xl font-black text-brand-charcoal">{config.social.whatsapp.includes('@') ? config.social.whatsapp : `sales@${config.id}.co.bw`}</p>
                                    {/* Note: I'll use a generic fallback for email if not explicitly in config, or just use config.id if needed. For LS it's sales@lslifestyle.co.bw */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-brand-sand/30">
                        <h2 className="text-2xl font-bold text-brand-green-deep uppercase mb-6">Send an Enquiry</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-brand-gray-neutral mb-2">Your Name</label>
                                <input type="text" className="w-full bg-brand-sand/10 border-2 border-brand-sand/30 rounded-xl px-4 py-3 focus:border-brand-green outline-none transition-colors text-brand-charcoal" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-brand-gray-neutral mb-2">Email Address</label>
                                <input type="email" className="w-full bg-brand-sand/10 border-2 border-brand-sand/30 rounded-xl px-4 py-3 focus:border-brand-green outline-none transition-colors text-brand-charcoal" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-brand-gray-neutral mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-brand-sand/10 border-2 border-brand-sand/30 rounded-xl px-4 py-3 focus:border-brand-green outline-none transition-colors text-brand-charcoal" placeholder="I'm interested in a product..."></textarea>
                            </div>
                            <button className="w-full btn-primary py-5 text-sm flex items-center justify-center gap-3 hover:shadow-2xl group">
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
