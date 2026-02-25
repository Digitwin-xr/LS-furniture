'use client';

import Navbar from '@/components/Navbar';

export default function FavoritesPage() {
    return (
        <main className="min-h-screen bg-brand-sand/20 pb-24">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-black text-brand-green-deep uppercase tracking-tighter mb-8 italic">
                    Saved <span className="text-brand-charcoal not-italic">Items</span>
                </h1>

                <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-brand-sand/30">
                    <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">❤️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-charcoal mb-4">Your collection is empty</h2>
                    <p className="text-brand-gray-neutral mb-8 max-w-md mx-auto">
                        Start exploring our catalogue and heart the items you love to see them here for later.
                    </p>
                    <a
                        href="/catalogue"
                        className="inline-block btn-primary px-8 py-4 text-sm tracking-widest hover:scale-105 transition-transform shadow-lg"
                    >
                        Browse Collection
                    </a>
                </div>
            </div>
        </main>
    );
}
