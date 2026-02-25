'use client';

import { Share2, MessageCircle, Facebook, Instagram, Mail } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
    productName: string;
    sku: string;
}

export default function ShareButton({ productName, sku }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out the ${productName} at LS Lifestyle Furniture!`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
                setIsOpen(!isOpen);
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    const socialPlatforms = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-[#25D366]',
            link: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-[#1877F2]',
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-brand-charcoal',
            link: `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        },
    ];

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="w-full py-3.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border-2 border-brand-sand text-brand-charcoal hover:border-brand-green hover:text-brand-green-deep bg-transparent"
            >
                <Share2 className="w-3.5 h-3.5" /> Share
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[120]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 bottom-full mb-4 z-[130] bg-white rounded-2xl shadow-2xl border border-brand-sand p-4 w-48 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col gap-2">
                            {socialPlatforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-sand transition-colors group"
                                >
                                    <div className={`w-8 h-8 ${platform.color} text-white rounded-lg flex items-center justify-center shadow-sm`}>
                                        <platform.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-brand-charcoal">{platform.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
