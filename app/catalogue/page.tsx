'use client';

import { useEffect, useState } from 'react';
import SmartGrid from '@/components/SmartGrid';
import RetailHeader from '@/components/RetailHeader';

export default function CataloguePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [initialCategory, setInitialCategory] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Read the category filter from the URL query string on the client
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category') || undefined;
        setInitialCategory(cat);

        // Load products from the pre-built products.json
        fetch('/products.json')
            .then(r => r.json())
            .then((data: any[]) => {
                setProducts(data);
                const cats = Array.from(new Set(data.map((p: any) => p.Category))).filter(Boolean) as string[];
                setCategories(cats);
            })
            .catch(err => console.error('Failed to load products.json', err));
    }, []);

    return (
        <div className="min-h-screen bg-white pb-20 pt-24">
            <RetailHeader />
            <main className="max-w-[1400px] mx-auto px-6 py-8">
                <SmartGrid
                    products={products}
                    categories={categories}
                    initialCategory={initialCategory}
                />
            </main>
        </div>
    );
}
