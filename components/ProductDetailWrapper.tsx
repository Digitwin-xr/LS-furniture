'use client';

import dynamic from 'next/dynamic';
import { Product } from '@/types';
import { useClient } from '@/engine/context/ClientContext';

const ProductDetail = dynamic(() => import('./ProductDetail'), {
    ssr: false,
    loading: () => <ProductDetailLoading />
});

function ProductDetailLoading() {
    const config = useClient();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center font-black animate-pulse opacity-20 text-brand-red uppercase tracking-[0.5em] summer-gradient">
            {config.shortName} BOUTIQUE...
        </div>
    );
}

export default function ProductDetailWrapper({ product }: { product: Product }) {
    return <ProductDetail product={product} />;
}
