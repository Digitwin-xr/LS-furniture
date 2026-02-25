import { getProducts } from '@/lib/products';
import Navbar from '@/components/Navbar';
import { notFound } from 'next/navigation';
import ProductDetailWrapper from '@/components/ProductDetailWrapper';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ sku: string[] }>;
}) {
    const products = await getProducts();
    const { sku } = await params;
    const skuString = sku.join('/');

    // Find product
    const product = products.find(p => p.SKU.trim().toUpperCase() === skuString.toUpperCase());

    if (!product) {
        notFound();
    }

    // Clean product data for serializable pass
    const serializedProduct = JSON.parse(JSON.stringify(product));

    return (
        <main className="min-h-screen bg-brand-sand/20 pb-24">
            <Navbar />
            <div className="animate-in fade-in duration-1000">
                <ProductDetailWrapper product={serializedProduct} />
            </div>
        </main>
    );
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        sku: product.SKU.split('/'),
    }));
}
