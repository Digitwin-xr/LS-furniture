'use client';

import Link from 'next/link';
import { Box, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const DynamicModelViewer = dynamic(() => import('./DynamicModelViewer'), { ssr: false });

export default function RetailSpatialDemo() {
    return (
        <section className="py-24 bg-[#FAFAFA] border-y border-gray-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Content Side */}
                <div className="space-y-8 order-2 lg:order-1">
                    <div>
                        <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.2em] mb-2">
                            Shopping Confidence
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                            See Furniture <br /> In Your Space.
                        </h3>
                    </div>

                    <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                        Ensure the perfect fit before you buy. Use your smartphone to project true-to-scale 3D models directly into your room. No app required.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-brand-green" /> Check dimensions accurately
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-brand-green" /> Match colors to your interior
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-brand-green" /> Review fine textures in 360°
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/catalogue"
                            className="inline-flex bg-white border-2 border-gray-200 hover:border-brand-green text-gray-900 hover:text-brand-green py-4 px-8 rounded-xl font-bold tracking-wide transition-colors items-center justify-center gap-3 shadow-sm active:scale-95"
                        >
                            <Box className="w-5 h-5" /> Try Spatial Placement
                        </Link>
                    </div>
                </div>

                {/* Minimal Demo Visual Side */}
                <div className="order-1 lg:order-2 w-full max-w-md mx-auto aspect-square relative bg-white rounded-full border-8 border-gray-50 shadow-2xl overflow-hidden flex items-center justify-center">

                    {/* Fake Room Grid Graphic */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(125,187,66,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(125,187,66,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [transform:perspective(500px)_rotateX(60deg)_scale(2)] origin-bottom pointer-events-none" />

                    <div className="relative z-10 w-3/4 h-3/4">
                        <DynamicModelViewer
                            src="/assets/models/11159_sofa_two_tone_l_shape_bao.glb"
                            alt="Placement Demo"
                            cameraControls={false}
                            autoRotate={true}
                        />
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-full shadow-lg pointer-events-none">
                        SCANNING FLOOR...
                    </div>
                </div>

            </div>
        </section>
    );
}
