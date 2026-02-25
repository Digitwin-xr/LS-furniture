import fs from 'fs';
import path from 'path';
// @ts-ignore
import Papa from 'papaparse';

// CONFIG
const CSV_PATH = path.join(process.cwd(), 'public', 'products.csv');
const MODELS_DIR = path.join(process.cwd(), 'public', 'assets', 'models');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images');
const OUTPUT_JSON_PATH = path.join(process.cwd(), 'public', 'products.json');

// TYPES
interface RawProduct {
    Category: string;
    SKU: string;
    "Product Name": string;
    WAS: string;
    NOW: string;
    SAVE: string;
}

interface EnrichedProduct extends RawProduct {
    modelPath: string | null;
    imagePath: string | null;
    hasModel: boolean;
    hasImage: boolean;
}

// MAIN
async function main() {
    console.log("🧵 Stitch MCP Discovery-First Binding Started...");

    // 1. Read CSV Data
    let rawProducts: RawProduct[] = [];
    if (fs.existsSync(CSV_PATH)) {
        const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
        const parseResult = Papa.parse<RawProduct>(csvContent, { header: true, skipEmptyLines: true });
        rawProducts = parseResult.data.map((p: RawProduct) => ({
            ...p,
            Category: p.Category?.trim() === 'DINNING' ? 'Dining' : p.Category?.trim(),
            SKU: p.SKU?.trim(),
            "Product Name": p["Product Name"]?.trim()
        })).filter((p: RawProduct) => p.SKU);
        console.log(`📋 Loaded ${rawProducts.length} products from CSV.`);
    } else {
        console.warn(`⚠️ CSV not found at ${CSV_PATH}. Proceeding with Discovery mode only.`);
    }

    // 2. Scan Asset Directories
    const modelFiles = fs.existsSync(MODELS_DIR)
        ? fs.readdirSync(MODELS_DIR).filter(f => f.toLowerCase().endsWith('.glb'))
        : [];
    console.log(`📦 Discovered ${modelFiles.length} GLB models.`);

    const imageFiles = fs.existsSync(IMAGES_DIR)
        ? fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        : [];
    console.log(`🖼️ Discovered ${imageFiles.length} product images.`);

    // 3. Discovery-First Pairing Logic
    const finalProducts: EnrichedProduct[] = [];
    const pairedModels = new Set<string>();
    const pairedCSVRows = new Set<number>();

    // Step A: Primary Pairing (Models ↔ CSV)
    modelFiles.forEach(modelFile => {
        const bestCSVMatchIndex = findBestCSVMatch(modelFile, rawProducts);

        if (bestCSVMatchIndex !== -1 && !pairedCSVRows.has(bestCSVMatchIndex)) {
            const product = rawProducts[bestCSVMatchIndex];
            const matchedImage = findBestImageMatch(product.SKU, product["Product Name"], imageFiles);

            finalProducts.push({
                ...product,
                modelPath: `/assets/models/${modelFile}`,
                imagePath: matchedImage ? `/assets/images/${matchedImage}` : null,
                hasModel: true,
                hasImage: !!matchedImage
            });

            pairedModels.add(modelFile);
            pairedCSVRows.add(bestCSVMatchIndex);
        }
    });

    console.log(`🔗 Paired ${pairedModels.size} models with CSV entries.`);

    // Step B: Inferred Products (Models with no CSV entry)
    const unpairedModels = modelFiles.filter(m => !pairedModels.has(m));
    unpairedModels.forEach(modelFile => {
        const inferredName = inferNameFromFilename(modelFile);
        const inferredSKU = modelFile.split(' ')[0].replace('.glb', '');
        const matchedImage = findBestImageMatch(inferredSKU, inferredName, imageFiles);

        finalProducts.push({
            Category: inferCategoryFromFilename(modelFile),
            SKU: inferredSKU,
            "Product Name": inferredName,
            WAS: null as any,
            NOW: "Ask for Price",
            SAVE: null as any,
            modelPath: `/assets/models/${modelFile}`,
            imagePath: matchedImage ? `/assets/images/${matchedImage}` : null,
            hasModel: true,
            hasImage: !!matchedImage
        });
    });

    if (unpairedModels.length > 0) {
        console.log(`✨ Generated ${unpairedModels.length} inferred product entries from orphan models.`);
    }

    // Step C: Unpaired CSV entries (Products with no model - optional based on requirement "Include every 3D model")
    // The instructions say "Treat products.csv as metadata source... Include every 3D model".
    // We'll include CSV entries even if they don't have models, but mark them as secondary.
    rawProducts.forEach((product, index) => {
        if (!pairedCSVRows.has(index)) {
            const matchedImage = findBestImageMatch(product.SKU, product["Product Name"], imageFiles);
            finalProducts.push({
                ...product,
                modelPath: null,
                imagePath: matchedImage ? `/assets/images/${matchedImage}` : null,
                hasModel: false,
                hasImage: !!matchedImage
            });
        }
    });

    // 4. Uniqueness & Duplication Control
    // Ensure one UI card per discovered model is effectively handled by Step A and B.
    // We already use a Set to track paired models.

    // 5. Save Output
    fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(finalProducts, null, 2));
    console.log(`\n💾 Saved ${finalProducts.length} verified products to ${OUTPUT_JSON_PATH}`);

    // Summary Report
    const totalWithModels = finalProducts.filter(p => p.hasModel).length;
    console.log(`\n📊 FINAL REPORT:`);
    console.log(`✅ Total Products: ${finalProducts.length}`);
    console.log(`📦 Products with Models: ${totalWithModels} / ${modelFiles.length} GLBs`);
    console.log(`🖼️ Products with Images: ${finalProducts.filter(p => p.hasImage).length}`);
}

// HELPERS
function normalize(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findBestCSVMatch(filename: string, products: RawProduct[]): number {
    const nFile = normalize(filename);

    // Try SKU match first (assuming SKU is usually at the start or distinct)
    for (let i = 0; i < products.length; i++) {
        const nSku = normalize(products[i].SKU);
        if (nSku.length > 2 && nFile.includes(nSku)) return i;
    }

    // Try Name match
    for (let i = 0; i < products.length; i++) {
        const nName = normalize(products[i]["Product Name"]);
        if (nName.length > 8 && nFile.includes(nName)) return i;
    }

    return -1;
}

function findBestImageMatch(sku: string, name: string, images: string[]): string | undefined {
    const nSku = normalize(sku);
    const nName = normalize(name);

    const candidates = images.filter(f => {
        const nFile = normalize(f);
        return nFile.includes(nSku) || (nName.length > 5 && nFile.includes(nName));
    });

    if (candidates.length === 0) return undefined;
    candidates.sort((a, b) => a.length - b.length);
    return candidates[0];
}

function inferNameFromFilename(filename: string): string {
    return filename
        .replace('.glb', '')
        .replace(/^[A-Z0-9]+ /, '') // Remove SKU prefix if present
        .replace(/_/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function inferCategoryFromFilename(filename: string): string {
    const f = filename.toLowerCase();
    if (f.includes('sofa') || f.includes('couch')) return 'Sofas';
    if (f.includes('dining') || f.includes('dinning')) return 'Dining';
    if (f.includes('chair') || f.includes('stool')) return 'Chairs';
    if (f.includes('bed') || f.includes('mattress')) return 'Beds';
    if (f.includes('table') || f.includes('desk')) return 'Tables';
    if (f.includes('fridge') || f.includes('stove') || f.includes('fryer')) return 'Electronics';
    if (f.includes('wardrobe') || f.includes('robe') || f.includes('chest')) return 'Storage';
    return 'Miscellaneous';
}

main().catch(console.error);
