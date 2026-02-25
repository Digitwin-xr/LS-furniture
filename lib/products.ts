import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
    const jsonPath = path.join(process.cwd(), 'public', 'products.json');

    try {
        if (!fs.existsSync(jsonPath)) {
            console.error('products.json not found. Run "npx tsx scripts/stitch_bind.ts" first.');
            return [];
        }

        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const products = JSON.parse(fileContent);
        return products;
    } catch (error) {
        console.error('Error reading products.json:', error);
        return [];
    }
}
