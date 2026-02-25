'use client';

export default function HotSummerBadge() {
    return (
        <div className="absolute top-6 left-6 z-40" style={{ animation: 'badge-float 3s ease-in-out infinite' }}>
            <div className="relative group cursor-default summer-badge-glow">
                {/* Badge Container — Red + Yellow vibrant summer energy */}
                <div className="relative bg-brand-red text-white backdrop-blur-md border border-brand-red/30 rounded-full py-2.5 px-6 shadow-lg flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                    <span className="text-xl" style={{ animation: 'float 2s ease-in-out infinite' }}>🔥</span>
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest">HOT SUMMER</span>
                        <span className="text-[12px] font-black text-white uppercase italic tracking-tight">SALE LIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
