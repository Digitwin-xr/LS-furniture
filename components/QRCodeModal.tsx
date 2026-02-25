'use client';

import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    sku: string;
}

export default function QRCodeModal({ isOpen, onClose, productName, sku }: QRCodeModalProps) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Create a direct link to the product page with AR trigger
            const origin = window.location.origin;
            setUrl(`${origin}/product/${sku}?ar=true`);
        }
    }, [sku]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-brand-sand animate-in zoom-in-95 duration-300">
                <div className="p-8 flex flex-col items-center text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-sand transition-colors"
                    >
                        <X className="w-6 h-6 text-brand-charcoal/40" />
                    </button>

                    <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/20">
                        <Smartphone className="w-8 h-8 text-brand-charcoal" />
                    </div>

                    <h2 className="text-2xl font-black text-brand-charcoal uppercase tracking-tighter italic mb-2">
                        View <span className="text-brand-red">In Your Space</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">
                        Scan with your mobile camera to launch AR
                    </p>

                    <div className="p-6 bg-brand-sand rounded-[2rem] border-2 border-brand-sand/50 shadow-inner mb-8">
                        {url && (
                            <QRCodeSVG
                                value={url}
                                size={200}
                                level="H"
                                includeMargin={false}
                                imageSettings={{
                                    src: "/favicon.ico",
                                    x: undefined,
                                    y: undefined,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        )}
                    </div>

                    <div className="space-y-4 w-full">
                        <div className="flex items-center gap-4 bg-brand-sand/50 p-4 rounded-2xl border border-brand-sand text-left">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <Camera className="w-5 h-5 text-brand-yellow" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Product</p>
                                <p className="text-xs font-black text-brand-charcoal uppercase truncate max-w-[200px]">{productName}</p>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-400 font-medium">
                            Requires an AR-compatible iOS or Android device.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
