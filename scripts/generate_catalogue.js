/**
 * generate_catalogue.js
 * =====================
 * Enhanced Catalogue Generation Pipeline for LS Lifestyle Furniture & Appliances
 *
 * Pipeline steps:
 *  1. Read products.csv → canonical product list
 *  2. Scan public/assets/models/ → only properly-named GLBs (skip object_0 files)
 *  3. Fuzzy-match each GLB to a CSV product via SKU + product name
 *  4. Build enriched product entries with model URLs, descriptions, categories
 *  5. Write public/products.json (canonical data store for the app)
 *  6. Write public/catalogue.json (structured by category for the catalogue viewer)
 *
 * Run: node scripts/generate_catalogue.js
 */

const fs = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, 'public', 'products.csv');
const MODELS_DIR = path.join(ROOT, 'public', 'assets', 'models');
const OUT_JSON = path.join(ROOT, 'public', 'products.json');
const OUT_CATALOGUE = path.join(ROOT, 'public', 'catalogue.json');
const MAPPING_PATH = path.join(ROOT, 'scripts', 'model_mapping.json');

const BLOB_BASE = 'https://o45t2gs3y3cfhz4u.public.blob.vercel-storage.com';

// Category display order for catalogue
const CATEGORY_ORDER = [
    'Sofas', 'Chairs', 'Beds', 'WARDROBES', 'Dining',
    'Tables', 'Kitchen', 'TV Units', 'Electronics', 'Storage', 'Miscellaneous'
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Normalise string to lowercase alphanumeric for comparison */
function norm(s) {
    if (!s) return '';
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Title-case a string */
function titleCase(s) {
    return s.replace(/_/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

/** Convert a filename to a sanitised Blob key (lowercase, underscores) */
function toSanitisedKey(filename) {
    const ext = path.extname(filename).toLowerCase();
    const base = path.basename(filename, path.extname(filename));
    return base.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '') + ext;
}

/** Infer strict product category from filename and/or product name keywords */
function inferCategory(text) {
    if (!text) return 'Miscellaneous';
    const f = text.toLowerCase();

    // Strict priority overrides based on common LS furniture keywords
    if (f.includes('sofa') || f.includes('couch') || f.includes('lounge') || f.includes('daybed') || f.includes('recliner') || f.includes('seater') || f.includes('bugatti')) return 'Sofas';

    // Bed components (bases, headboards) must go to Beds, not Miscellaneous or Storage
    if (f.includes('bed') || f.includes('mattress') || f.includes('headboard') || f.includes('base') || f.includes('sleeper') || f.includes('blanket box') || f.includes('bunk') || f.includes('double') || f.includes('single') || f.includes('queen') || f.includes('lux') || f.includes('spine') || f.includes('sleep') || f.includes('bamboo')) return 'Beds';

    // WARDROBES
    if (f.includes('wardrobe') || f.includes('robe')) return 'WARDROBES';

    // Storage items
    if (f.includes('chest') || f.includes('drawer') || f.includes('cabinet') || f.includes('dresser') || f.includes('shelf') || f.includes('metal')) return 'Storage';

    // Chairs / Seating
    if (f.includes('chair') || f.includes('stool') || f.includes('barstool') || f.includes('ottoman')) return 'Chairs';

    // Dining sets
    if (f.includes('dining') || f.includes('dinning') || f.includes('buffet') || f.includes('server')) return 'Dining';

    // Tables (Coffee, Occasional)
    if (f.includes('table') || f.includes('desk') || f.includes('coffee')) return 'Tables';

    // TV Units & Media
    if (f.includes('tv') || f.includes('stand') || f.includes('plasma') || f.includes('entertainment')) return 'TV Units';

    // Kitchen Schemes
    if (f.includes('kitchen') || f.includes('scheme') || f.includes('combo')) return 'Kitchen';

    // Appliances / Electronics
    if (f.includes('fridge') || f.includes('freezer') || f.includes('washing') || f.includes('microwave') || f.includes('fryer') || f.includes('stove') || f.includes('oven') || f.includes('defy') || f.includes('hisense') || f.includes('totai') || f.includes('blaze')) return 'Electronics';

    // If it has 'pedestal' but no other context, usually maps to Bedroom
    if (f.includes('pedestal')) return 'Beds';

    return 'Miscellaneous';
}

/** Generate a short human-readable description from category + name */
function makeDescription(category, productName, csvDescription) {
    if (csvDescription && csvDescription.trim()) return csvDescription.trim();
    
    const templates = {
        'Sofas': `Stylish ${productName} — comfortable seating for your living room.`,
        'Chairs': `${productName} — ergonomic design for home or office.`,
        'Beds': `${productName} — premium sleep solution for restful nights.`,
        'WARDROBES': `${productName} — spacious storage with elegant finish.`,
        'Dining': `${productName} — perfect centrepiece for family dining.`,
        'Tables': `${productName} — versatile surface for any room.`,
        'Kitchen': `${productName} — modern kitchen solution for your home.`,
        'TV Units': `${productName} — sleek media storage and display unit.`,
        'Electronics': `${productName} — trusted home appliance with great value.`,
        'Storage': `${productName} — practical storage with lasting quality.`,
        'Miscellaneous': `${productName} — quality furniture piece from LS Lifestyle.`,
    };
    return templates[category] || `${productName} — quality furniture from LS Lifestyle.`;
}

// ─── CSV PARSER ───────────────────────────────────────────────────────────────

function parseCSV(content) {
    const rows = [];
    let currentLine = [];
    let currentField = '';
    let inQuote = false;

    // Normalize line endings and split by character for robust parsing
    const chars = content.replace(/\r/g, ''); 
    
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const nextChar = chars[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            currentLine.push(currentField.trim());
            currentField = '';
        } else if (char === '\n' && !inQuote) {
            currentLine.push(currentField.trim());
            rows.push(currentLine);
            currentLine = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    // Push last field/line if exists
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        rows.push(currentLine);
    }

    if (rows.length === 0) return [];
    
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = row[idx] || '';
        });
        return obj;
    }).filter(p => p.SKU); // Ensure it has at least an SKU
}

// ─── MATCHING ─────────────────────────────────────────────────────────────────

/**
 * Manual override map: glb sanitised basename → CSV SKU
 * Used when automatic matching would produce a wrong result.
 */
const MANUAL_OVERRIDES = {
    // Kitchen combos — filename says alaska/romeo but product SKU is numeric
    'alaska_kitchen_combo_baf': '8478',
    'romeo_kitchen_combo_baf': '16155',
    'romeo_kitchen_combo_baf2': '16155',
    'romeo_kitchen_scheme_3pcs_baf': '16150',
    // Bar chair — mwbc72a file should map to MWBC72A/B not Squiggle Chair
    'mwbc72a_s_bar_chair_red_black_minimalist': 'MWBC72A/B',
    // TV stand duplicates
    'mwbr684_tv_stand_londres_off_white_mat': 'MWBR6854',
    // Sofa — typo "SINGE" vs "SINGLE"
    'sofa_singe_3div_square_arm_ma': '2999',
    // Pedestal bed set
    '21518_pedestal_york_baf': '215',
    'wardrobe_4_door_white_dark_g': 'MW762',
};

// Category overrides: SKU → Category Name
const CATEGORY_OVERRIDES = {
    'MW762': 'WARDROBES',     // 4 Door White + Dark G
    'YG3': 'WARDROBES',       // Robe 3Door Metal + Mirror Whit
    '215': 'Beds',            // Budget Double (1 Star) 1370 MY
    'JX1011': 'Chairs',       // Chair Manager Metal Base Black
    '22488': 'Kitchen',       // Vegas 2Door Kitchen Base BAF
    '6744': 'Kitchen',        // Linda Base 2Door BAF
    '23025': 'Kitchen',       // Vegas 3Door Kitchen Base BAF
    '5011-3-HY': 'Kitchen',    // Kitchenbase 3Door Grey Plaza
    'MWBR3DBC': 'Kitchen',    // Kitchen Base Nogueira/White
};

/**
 * Find the best CSV product for a given GLB filename.
 * Priority: manual override → SKU exact match → SKU contained → name fuzzy match
 */
function findBestMatch(filename, csvProducts) {
    const ext = path.extname(filename);
    const baseKey = path.basename(filename, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');

    const nFile = norm(filename);

    // 0. Manual override
    if (MANUAL_OVERRIDES[baseKey]) {
        const overrideSKU = MANUAL_OVERRIDES[baseKey];
        const overrideIdx = csvProducts.findIndex(p => p.SKU === overrideSKU);
        if (overrideIdx !== -1) return overrideIdx;
    }

    // 1. SKU exact prefix match (filename starts with normalised SKU)
    for (let i = 0; i < csvProducts.length; i++) {
        const nSku = norm(csvProducts[i].SKU);
        if (nSku.length >= 2 && nFile.startsWith(nSku)) return i;
    }

    // 2. SKU contained anywhere in filename
    for (let i = 0; i < csvProducts.length; i++) {
        const nSku = norm(csvProducts[i].SKU);
        if (nSku.length >= 2 && nFile.includes(nSku)) return i;
    }

    // 3. Product name fuzzy — require ≥ 70% of meaningful tokens to match
    //    AND at least 2 matching tokens to avoid false positives
    for (let i = 0; i < csvProducts.length; i++) {
        const tokens = csvProducts[i]['Product Name']
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .split(' ')
            .filter(t => t.length >= 4); // only longer words, skip small filler words

        if (tokens.length === 0) continue;
        const matches = tokens.filter(t => nFile.includes(t));
        const ratio = matches.length / tokens.length;
        if (ratio >= 0.70 && matches.length >= 2) return i;
    }

    return -1;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log('\n🏗️  LS Lifestyle Catalogue Generation Engine');
    console.log('━'.repeat(50));

    // 1. Read CSV
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`❌ CSV not found: ${CSV_PATH}`);
        process.exit(1);
    }
    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
    const parsed = parseCSV(csvContent);
    const csvProducts = parsed.map(p => {
        let cat = p.Category === 'DINNING' || p.Category === 'Dinning' ? 'Dinning' : p.Category;
        const sku = p.SKU.trim();

        // 1. Manual Category Override
        if (CATEGORY_OVERRIDES[sku]) {
            cat = CATEGORY_OVERRIDES[sku];
        } 
        // 2. Inference if missing
        else if (!cat && p['Product Name']) {
            cat = inferCategory(p['Product Name']);
        }

        return {
            ...p,
            Category: cat,
            SKU: sku,
            'Product Name': p['Product Name'].trim(),
        };
    });
    console.log(`\n📋 Loaded ${csvProducts.length} products from CSV`);

    // 2. Scan models directory — SKIP unnamed object_0 files
    if (!fs.existsSync(MODELS_DIR)) {
        console.error(`❌ Models directory not found: ${MODELS_DIR}`);
        process.exit(1);
    }

    const allGlbs = fs.readdirSync(MODELS_DIR).filter(f => f.toLowerCase().endsWith('.glb'));

    // 2.5 Load Manual Mapping
    let modelMapping = {};
    if (fs.existsSync(MAPPING_PATH)) {
        modelMapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
        console.log(`📂 Loaded mapping for ${Object.keys(modelMapping).length} models`);
    }

    const namedGlbs = allGlbs.filter(f => !f.toLowerCase().startsWith('object_0'));
    const unRenamedGlbs = allGlbs.filter(f => f.toLowerCase().startsWith('object_0'));

    console.log(`\n📦 Found ${allGlbs.length} total GLB files`);
    console.log(`   ✅ ${namedGlbs.length} named models`);
    console.log(`   🔶 ${unRenamedGlbs.length} un-renamed object_0 files`);

    // 3. Match models to CSV products
    const finalProducts = [];
    const pairedCSVRows = new Set();
    const matchLog = [];
    const usedSKUs = new Map();

    function uniqueSKU(base) {
        if (!base) return 'MISC';
        const s = String(base).trim().toUpperCase();
        if (!usedSKUs.has(s)) { usedSKUs.set(s, 0); return s; }
        const n = usedSKUs.get(s) + 1;
        usedSKUs.set(s, n);
        return `${s}_${n}`;
    }

    // Step A — Process ALL GLBs
    for (const glbFile of allGlbs) {
        const sanitisedKey = toSanitisedKey(glbFile);
        const stats = fs.statSync(path.join(MODELS_DIR, glbFile));
        const sizeMB = stats.size / (1024 * 1024);

        let matchIdx = -1;
        let mappingInfo = modelMapping[glbFile];

        if (mappingInfo) {
            // Priority 1: Use the SKU from the manual mapping tool
            matchIdx = csvProducts.findIndex(p => String(p.SKU).trim().toUpperCase() === String(mappingInfo.sku).trim().toUpperCase());
        }

        if (matchIdx === -1) {
            // Priority 2: Standard matching logic
            matchIdx = findBestMatch(glbFile, csvProducts);
        }

        if (matchIdx !== -1 && !pairedCSVRows.has(matchIdx)) {
            const product = csvProducts[matchIdx];
            finalProducts.push({
                Category: product.Category,
                SKU: uniqueSKU(product.SKU),
                'Product Name': product['Product Name'],
                WAS: product['WAS Price'] || product.WAS || null,
                NOW: product['NOW ONLY Price'] || product.NOW || 'Ask for Price',
                SAVE: product.SAVE || null,
                modelPath: `/assets/models/${glbFile}`,
                imagePath: null,
                hasModel: true,
                hasImage: false,
                description: makeDescription(product.Category, product['Product Name'], product['Product Description']),
                fileSizeMB: parseFloat(sizeMB.toFixed(2)),
                glbFile: sanitisedKey,
            });

            pairedCSVRows.add(matchIdx);
            matchLog.push(`  ✅ "${glbFile}" → [${product.SKU}] ${product['Product Name']}`);
        } else {
            // Orphan model — infer product from filename OR mapping
            const inferredCat = inferCategory(glbFile);
            const baseName = mappingInfo ? mappingInfo.productName : path.basename(glbFile, path.extname(glbFile));
            const inferredName = titleCase(baseName.replace(/^[A-Z0-9\-]+ /i, ''));
            const inferredSKU = mappingInfo ? mappingInfo.sku : path.basename(glbFile, path.extname(glbFile)).split(/[\s_-]/)[0].toUpperCase();

            finalProducts.push({
                Category: inferredCat,
                SKU: uniqueSKU(inferredSKU),
                'Product Name': inferredName,
                WAS: null,
                NOW: 'Ask for Price',
                SAVE: null,
                modelPath: `/assets/models/${glbFile}`,
                imagePath: null,
                hasModel: true,
                hasImage: false,
                description: makeDescription(inferredCat, inferredName, null),
                fileSizeMB: parseFloat(sizeMB.toFixed(2)),
                glbFile: sanitisedKey,
            });
            matchLog.push(`  🔶 "${glbFile}" → [INFERRED] ${inferredName} (${inferredCat})`);
        }
    }

    console.log('\n🔗 Model-to-Product Matching:');
    matchLog.forEach(l => console.log(l));

    // Step B — Add remaining unmatched CSV products (no model)
    csvProducts.forEach((product, idx) => {
        if (pairedCSVRows.has(idx)) return;
        finalProducts.push({
            Category: product.Category,
            SKU: uniqueSKU(product.SKU),
            'Product Name': product['Product Name'],
            WAS: product['WAS Price'] || product.WAS || null,
            NOW: product['NOW ONLY Price'] || product.NOW || 'Ask for Price',
            SAVE: product.SAVE || null,
            modelPath: null,
            imagePath: null,
            hasModel: false,
            hasImage: false,
            description: makeDescription(product.Category, product['Product Name'], product['Product Description']),
            fileSizeMB: null,
            glbFile: null,
        });
    });

    // 4. Sort by category order then product name
    finalProducts.sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a.Category);
        const bi = CATEGORY_ORDER.indexOf(b.Category);
        const catSort = (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        if (catSort !== 0) return catSort;
        return (a['Product Name'] || '').localeCompare(b['Product Name'] || '');
    });

    // 5. Write products.json
    fs.writeFileSync(OUT_JSON, JSON.stringify(finalProducts, null, 2));
    console.log(`\n💾 Written ${finalProducts.length} products → ${OUT_JSON}`);

    // 6. Build & write catalogue.json (grouped by category)
    const catalogueGroups = {};
    for (const p of finalProducts) {
        const cat = p.Category || 'Miscellaneous';
        if (!catalogueGroups[cat]) catalogueGroups[cat] = [];
        catalogueGroups[cat].push(p);
    }

    const catalogue = CATEGORY_ORDER
        .filter(cat => catalogueGroups[cat]?.length)
        .map(cat => ({
            category: cat,
            productCount: catalogueGroups[cat].length,
            products: catalogueGroups[cat],
        }));

    // Add any categories not in the order list
    for (const [cat, prods] of Object.entries(catalogueGroups)) {
        if (!CATEGORY_ORDER.includes(cat)) {
            catalogue.push({ category: cat, productCount: prods.length, products: prods });
        }
    }

    fs.writeFileSync(OUT_CATALOGUE, JSON.stringify(catalogue, null, 2));
    console.log(`💾 Written structured catalogue → ${OUT_CATALOGUE}`);

    // 7. Summary report
    const withModels = finalProducts.filter(p => p.hasModel).length;
    const withoutModels = finalProducts.filter(p => !p.hasModel).length;
    const categories = [...new Set(finalProducts.map(p => p.Category))];

    console.log('\n📊 CATALOGUE GENERATION REPORT');
    console.log('━'.repeat(50));
    console.log(`📦 Total Products:       ${finalProducts.length}`);
    console.log(`✅ With 3D Models:       ${withModels}`);
    console.log(`📋 Without Models:       ${withoutModels}`);
    console.log(`🏷️  Categories:           ${categories.length}`);
    console.log(`\nCategory Breakdown:`);
    for (const cat of CATEGORY_ORDER) {
        if (catalogueGroups[cat]) {
            const g = catalogueGroups[cat];
            const wModel = g.filter(p => p.hasModel).length;
            console.log(`  ${cat.padEnd(14)} ${String(g.length).padStart(3)} products  (${wModel} with 3D model)`);
        }
    }
    console.log('\n✨ Done!');
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
