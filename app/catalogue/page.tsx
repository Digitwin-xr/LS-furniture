import { getProducts } from '@/lib/products';
import SmartGrid from '@/components/SmartGrid';
import RetailHeader from '@/components/RetailHeader';

export default async function CataloguePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const products = await getProducts();
    const { category } = await searchParams;

    const categories = Array.from(new Set(products.map(p => p.Category))).filter(Boolean) as string[];

    return (
        <div className="min-h-screen bg-white pb-20 pt-24">
            <RetailHeader />

            <main className="max-w-[1400px] mx-auto px-6 py-8">





                <SmartGrid
                    products={products}
                    categories={categories}
                    initialCategory={category}
                />
            </main>
        </div>
    );
}

