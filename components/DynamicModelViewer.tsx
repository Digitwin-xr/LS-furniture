'use client';

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./ModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
});

export default ModelViewer;
