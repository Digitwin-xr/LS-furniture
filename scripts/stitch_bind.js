const fs = require('fs');
const path = require('path');

// PapaParse simulation or simple CSV parser if not available as require
// Since papaparse is in node_modules, we can try to require it.
let Papa;
try {
    Papa = require('papaparse');
} catch (e) {
    console.log("⚠️ PapaParse not found via require, using simple splitter.");
}

// CONFIG
const CSV_PATH = path.join(process.cwd(), 'public', 'products.csv');
const MODELS_DIR = path.join(process.cwd(), 'public', 'assets', 'models');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images');
const OUTPUT_JSON_PATH = path.join(process.cwd(), 'public', 'products.json');

// MAIN
async function main() {
    console.log("🧵 Stitch MCP Discovery-First Binding Started (JS Version)...");

    // 1. Read CSV Data
    let rawProducts = [];
    if (fs.existsSync(CSV_PATH)) {
        const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
        if (Papa) {
            const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
            rawProducts = parseResult.data.map(p => ({
                ...p,
                Category: p.Category && p.Category.trim().toUpperCase() === 'DINNING' ? 'Dining' : (p.Category ? p.Category.trim() : 'Miscellaneous'),
                SKU: p.SKU ? p.SKU.trim() : '',
                "Product Name": p["Product Name"] ? p["Product Name"].trim() : ''
            })).filter(p => p.SKU);
        } else {
            // Simple CSV fallback
            const lines = csvContent.split('\n');
            const headers = lines[0].split(',');
            rawProducts = lines.slice(1).map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : '');
                return obj;
            }).filter(p => p.SKU);
        }
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
    const finalProducts = [];
    const pairedModels = new Set();
    const pairedCSVRows = new Set();
    const usedSKUs = new Map(); // SKU -> Count

    function getUniqueSKU(baseSKU) {
        if (!usedSKUs.has(baseSKU)) {
            usedSKUs.set(baseSKU, 1);
            return baseSKU;
        }
        const count = usedSKUs.get(baseSKU) + 1;
        usedSKUs.set(baseSKU, count);
        return `${baseSKU}_${count}`;
    }

    // Step A: Primary Pairing (Models ↔ CSV)
    modelFiles.forEach(modelFile => {
        const bestCSVMatchIndex = findBestCSVMatch(modelFile, rawProducts);

        if (bestCSVMatchIndex !== -1 && !pairedCSVRows.has(bestCSVMatchIndex)) {
            const product = rawProducts[bestCSVMatchIndex];
            const matchedImage = findBestImageMatch(product.SKU, product["Product Name"], imageFiles);

            finalProducts.push({
                ...product,
                SKU: getUniqueSKU(product.SKU),
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
            SKU: getUniqueSKU(inferredSKU),
            "Product Name": inferredName,
            WAS: null,
            NOW: "Ask for Price",
            SAVE: null,
            modelPath: `/assets/models/${modelFile}`,
            imagePath: matchedImage ? `/assets/images/${matchedImage}` : null,
            hasModel: true,
            hasImage: !!matchedImage
        });
    });

    if (unpairedModels.length > 0) {
        console.log(`✨ Generated ${unpairedModels.length} inferred product entries from orphan models.`);
    }

    // Step C: Unpaired CSV entries
    rawProducts.forEach((product, index) => {
        if (!pairedCSVRows.has(index)) {
            const matchedImage = findBestImageMatch(product.SKU, product["Product Name"], imageFiles);
            finalProducts.push({
                ...product,
                SKU: getUniqueSKU(product.SKU),
                modelPath: null,
                imagePath: matchedImage ? `/assets/images/${matchedImage}` : null,
                hasModel: false,
                hasImage: !!matchedImage
            });
        }
    });

    // 5. Save Output
    fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(finalProducts, null, 2));
    console.log(`\n💾 Saved ${finalProducts.length} verified products to ${OUTPUT_JSON_PATH}`);

    // Summary
    const totalWithModels = finalProducts.filter(p => p.hasModel).length;
    console.log(`\n📊 FINAL REPORT:`);
    console.log(`✅ Total Products: ${finalProducts.length}`);
    console.log(`📦 Products with Models: ${totalWithModels} / ${modelFiles.length} GLBs`);
}

// HELPERS
function normalize(s) {
    if (!s) return '';
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findBestCSVMatch(filename, products) {
    const nFile = normalize(filename);

    for (let i = 0; i < products.length; i++) {
        const nSku = normalize(products[i].SKU);
        if (nSku.length > 2 && nFile.includes(nSku)) return i;
    }

    for (let i = 0; i < products.length; i++) {
        const nName = normalize(products[i]["Product Name"]);
        if (nName.length > 8 && nFile.includes(nName)) return i;
    }

    return -1;
}

function findBestImageMatch(sku, name, images) {
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

function inferNameFromFilename(filename) {
    return filename
        .replace('.glb', '')
        .replace(/^[A-Z0-9]+ /, '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function inferCategoryFromFilename(filename) {
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
