import { getProducts } from '@/lib/products';
import SmartGrid from '@/components/SmartGrid';
import Navbar from '@/components/Navbar';
import { getClientConfig } from '@/engine/config/client-config';

export default async function CataloguePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const products = await getProducts();
    const { category } = await searchParams;
    const config = getClientConfig();

    return (
        <div className="min-h-screen bg-brand-sand/20 pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-brand-green-deep uppercase tracking-tighter italic leading-none mb-4">
                        {config.shortName} <span className="text-brand-red">Collection.</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-brand-yellow rounded-full mb-6" />
                    <p className="text-brand-gray-neutral font-medium tracking-wide text-sm max-w-xl">
                        Discover 3D-ready furniture & appliances, rendered with lifestyle precision. Use our WebXR viewer to bring any piece into your space.
                    </p>
                </header>

                <SmartGrid products={products} initialCategory={category as any} />
            </main>
        </div>
    );
}
