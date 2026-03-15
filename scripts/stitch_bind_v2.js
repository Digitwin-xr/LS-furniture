/**
 * stitch_bind_v2.js
 * Enhanced Catalogue Engine — LS Lifestyle Furniture & Appliances
 * 
 * - Handles UPPERCASE spaced GLB filenames (new uploads)
 * - Matches models to CSV catalogue by SKU & product name
 * - Infers category/name for orphan models (not in CSV)
 * - Skips unnamed object_0-timestamp.glb renders
 * - Uses Vercel Blob URLs for all matched models
 * - Outputs the full structured products.json
 */

const fs = require('fs');
const path = require('path');

// ── CONFIG ──────────────────────────────────────────────────────────────────
const CSV_PATH = path.join(process.cwd(), 'public', 'products.csv');
const MODELS_DIR = path.join(process.cwd(), 'public', 'assets', 'models');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images');
const OUTPUT_JSON = path.join(process.cwd(), 'public', 'products.json');
const BLOB_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/ls-furniture-d53dd.firebasestorage.app/o/assets%2Fmodels';
const MAX_MODEL_MB = 10;

// ── HELPERS ──────────────────────────────────────────────────────────────────

/** Normalise a string for fuzzy matching (lowercase alphanum only) */
function norm(s) {
    if (!s) return '';
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Convert an UPPERCASE spaced/dashed GLB filename to a clean Vercel Blob key.
 * e.g. "ALASKA KITCHEN COMBO BAF.glb" → "alaska_kitchen_combo_baf.glb"
 */
function sanitize(filename) {
    const ext = path.extname(filename).toLowerCase();
    const base = path.basename(filename, path.extname(filename));
    return base
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '')
        + ext;
}

/** Convert sanitized filename base to a human-readable product name */
function inferName(filename) {
    return path.basename(filename, path.extname(filename))
        .replace(/[_-]/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Infer product category from filename keywords.
 * Extended to cover all LS catalogue categories.
 */
function inferCategory(filename) {
    const f = filename.toLowerCase();
    if (f.includes('sofa') || f.includes('couch') || f.includes('daybed') || f.includes('lounge')) return 'Sofas';
    if (f.includes('dining') || f.includes('dinning')) return 'Dining';
    if (f.includes('chair') || f.includes('stool') || f.includes('barstool') || f.includes('seat')) return 'Chairs';
    if (f.includes('bed') || f.includes('mattress') || f.includes('headboard')) return 'Beds';
    if (f.includes('wardrobe') || f.includes('robe') || f.includes('chest') || f.includes('drawer')) return 'Storage';
    if (f.includes('table') || f.includes('desk') || f.includes('ct23')) return 'Tables';
    if (f.includes('tv') || f.includes('stand')) return 'TV Units';
    if (f.includes('kitchen') || f.includes('microwave') || f.includes('fridge') ||
        f.includes('freezer') || f.includes('washing') || f.includes('fryer')) return 'Electronics';
    if (f.includes('pedestal') || f.includes('blanket') || f.includes('cabinet') ||
        f.includes('headboard') || f.includes('vegas') || f.includes('mirror')) return 'Miscellaneous';
    return 'Miscellaneous';
}

/** Return true if filename looks like an unnamed render (object_0-timestamp) */
function isUnnamedRender(filename) {
    return /^object_0[\s\-]/.test(filename) || filename === 'object_0 (100).glb';
}

/**
 * Find the best CSV row index for a given GLB filename.
 * Priority: SKU match first, then product name match.
 */
function findCSVMatch(filename, products) {
    const nFile = norm(filename);

    // Pass 1 – SKU prefix match
    for (let i = 0; i < products.length; i++) {
        const nSku = norm(products[i].SKU);
        if (nSku.length > 2 && nFile.startsWith(nSku)) return i;
    }
    // Pass 2 – SKU substring match
    for (let i = 0; i < products.length; i++) {
        const nSku = norm(products[i].SKU);
        if (nSku.length > 2 && nFile.includes(nSku)) return i;
    }
    // Pass 3 – Product name substring (≥8 chars to avoid false positives)
    for (let i = 0; i < products.length; i++) {
        const nName = norm(products[i]['Product Name']);
        if (nName.length > 7 && nFile.includes(nName.slice(0, Math.min(nName.length, 18)))) return i;
    }

    return -1;
}

/** Find the best matching image for a product */
function findImage(sku, name, images) {
    const nSku = norm(sku);
    const nName = norm(name);
    const hits = images.filter(f => {
        const nf = norm(f);
        return nf.includes(nSku) || (nName.length > 5 && nf.includes(nName.slice(0, 12)));
    });
    if (!hits.length) return null;
    hits.sort((a, b) => a.length - b.length);
    return hits[0];
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🧵  LS Stitch Engine v2 — Catalogue Binding Started\n');

    // 1. Load CSV
    let rawProducts = [];
    if (!fs.existsSync(CSV_PATH)) {
        console.warn('⚠️  products.csv not found — discovery-only mode.');
    } else {
        let Papa;
        try { Papa = require('papaparse'); } catch (_) { }
        const csv = fs.readFileSync(CSV_PATH, 'utf8');
        if (Papa) {
            const result = Papa.parse(csv, { header: true, skipEmptyLines: true });
            rawProducts = result.data.map(p => ({
                ...p,
                Category: inferCategory((p['Product Name'] || '').trim()),
                SKU: (p.SKU || '').trim(),
                'Product Name': (p['Product Name'] || '').trim(),
                WAS: p['WAS Price'] || p.WAS || null,
                NOW: p['NOW ONLY Price'] || p.NOW || 'Ask for Price',
                SAVE: p.SAVE || null,
            })).filter(p => p.SKU);
        } else {
            // Fallback simple parser
            const lines = csv.split('\n');
            const headers = lines[0].split(',');
            rawProducts = lines.slice(1).map(line => {
                const vals = line.split(',');
                const obj = {};
                headers.forEach((h, i) => obj[h.trim()] = (vals[i] || '').trim());
                return {
                    ...obj,
                    Category: inferCategory((obj['Product Name'] || '').trim()),
                    WAS: obj['WAS Price'] || obj.WAS || null,
                    NOW: obj['NOW ONLY Price'] || obj.NOW || 'Ask for Price',
                    SAVE: obj.SAVE || null
                };
            }).filter(p => p.SKU);
        }
        console.log(`📋  Loaded ${rawProducts.length} products from CSV`);
    }

    // 2. Scan model files — skip unnamed renders
    const allModelFiles = fs.existsSync(MODELS_DIR)
        ? fs.readdirSync(MODELS_DIR).filter(f => f.toLowerCase().endsWith('.glb'))
        : [];
    const namedModels = allModelFiles.filter(f => !isUnnamedRender(f));
    const skippedRenders = allModelFiles.length - namedModels.length;
    console.log(`📦  ${allModelFiles.length} total GLBs — using ${namedModels.length} named, skipping ${skippedRenders} unnamed renders`);

    const imageFiles = fs.existsSync(IMAGES_DIR)
        ? fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        : [];
    console.log(`🖼️   ${imageFiles.length} product images found\n`);

    // 3. Binding
    const finalProducts = [];
    const pairedCSVRows = new Set();
    const pairedModels = new Set();
    const usedSKUs = new Map();

    function uniqueSKU(base) {
        if (!usedSKUs.has(base)) { usedSKUs.set(base, 1); return base; }
        const n = usedSKUs.get(base) + 1;
        usedSKUs.set(base, n);
        return `${base}_${n}`;
    }

    // ── Pass A: Named model → CSV match ──────────────────────────────────────
    for (let rawFile of namedModels) {
        const sanitized = sanitize(rawFile);

        // Rename file if needed
        if (rawFile !== sanitized) {
            const srcPath = path.join(MODELS_DIR, rawFile);
            const dstPath = path.join(MODELS_DIR, sanitized);
            if (!fs.existsSync(dstPath)) {
                fs.renameSync(srcPath, dstPath);
                console.log(`🏷️   Renamed: "${rawFile}" → "${sanitized}"`);
            } else {
                console.log(`ℹ️   Already exists, skipping rename: "${sanitized}"`);
            }
            rawFile = sanitized;
        }

        const csvIdx = findCSVMatch(rawFile, rawProducts);
        const stats = fs.statSync(path.join(MODELS_DIR, rawFile));
        const sizeMB = stats.size / (1024 * 1024);

        if (csvIdx !== -1 && !pairedCSVRows.has(csvIdx)) {
            const p = rawProducts[csvIdx];
            const img = findImage(p.SKU, p['Product Name'], imageFiles);
            const blob = `${BLOB_BASE_URL}%2F${encodeURIComponent(rawFile)}?alt=media`;

            finalProducts.push({
                Category: p.Category,
                SKU: uniqueSKU(p.SKU),
                'Product Name': p['Product Name'],
                WAS: p.WAS || null,
                NOW: p.NOW || 'Ask for Price',
                SAVE: p.SAVE || null,
                modelPath: sizeMB <= MAX_MODEL_MB ? blob : null,
                imagePath: img ? `/assets/images/${img}` : null,
                hasModel: sizeMB <= MAX_MODEL_MB,
                hasImage: !!img,
            });

            pairedCSVRows.add(csvIdx);
            pairedModels.add(rawFile.toLowerCase());
            if (sizeMB > MAX_MODEL_MB) console.log(`⚠️   Large model (${sizeMB.toFixed(1)}MB), model path cleared: ${rawFile}`);

        } else if (csvIdx === -1) {
            // Orphan model — infer name & category
            const inferredName = inferName(rawFile);
            const inferredSKU = path.basename(rawFile, '.glb').split('_')[0].toUpperCase();
            const img = findImage(inferredSKU, inferredName, imageFiles);
            const blob = `${BLOB_BASE_URL}%2F${encodeURIComponent(rawFile)}?alt=media`;

            finalProducts.push({
                Category: inferCategory(rawFile),
                SKU: uniqueSKU(inferredSKU),
                'Product Name': inferredName,
                WAS: null,
                NOW: 'Ask for Price',
                SAVE: null,
                modelPath: sizeMB <= MAX_MODEL_MB ? blob : null,
                imagePath: img ? `/assets/images/${img}` : null,
                hasModel: sizeMB <= MAX_MODEL_MB,
                hasImage: !!img,
            });

            pairedModels.add(rawFile.toLowerCase());
            console.log(`✨  Inferred orphan: "${inferredName}" [${inferCategory(rawFile)}]`);
        }
    }

    console.log(`\n🔗  Paired ${pairedCSVRows.size} models to CSV entries`);

    // ── Pass B: Remaining CSV rows with no model ──────────────────────────────
    rawProducts.forEach((p, idx) => {
        if (pairedCSVRows.has(idx)) return;
        const img = findImage(p.SKU, p['Product Name'], imageFiles);
        finalProducts.push({
            Category: p.Category,
            SKU: uniqueSKU(p.SKU),
            'Product Name': p['Product Name'],
            WAS: p.WAS || null,
            NOW: p.NOW || 'Ask for Price',
            SAVE: p.SAVE || null,
            modelPath: null,
            imagePath: img ? `/assets/images/${img}` : null,
            hasModel: false,
            hasImage: !!img,
        });
    });

    // 4. Sort: products with models first, then by category + name
    finalProducts.sort((a, b) => {
        if (a.hasModel !== b.hasModel) return a.hasModel ? -1 : 1;
        if (a.Category !== b.Category) return a.Category.localeCompare(b.Category);
        return (a['Product Name'] || '').localeCompare(b['Product Name'] || '');
    });

    // 5. Write output
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(finalProducts, null, 2));

    // 6. Summary
    const withModel = finalProducts.filter(p => p.hasModel).length;
    const withoutModel = finalProducts.filter(p => !p.hasModel).length;
    const categories = [...new Set(finalProducts.map(p => p.Category))].sort();

    console.log('\n══════════════════════════════════════════');
    console.log('📊  FINAL CATALOGUE REPORT');
    console.log('══════════════════════════════════════════');
    console.log(`✅  Total Products    : ${finalProducts.length}`);
    console.log(`📦  With 3D Model     : ${withModel}`);
    console.log(`📋  Without Model     : ${withoutModel}`);
    console.log(`🗂️   Categories        : ${categories.join(', ')}`);
    console.log(`💾  Output            : ${OUTPUT_JSON}`);
    console.log('══════════════════════════════════════════\n');
}

main().catch(err => { console.error('❌ Engine error:', err); process.exit(1); });
