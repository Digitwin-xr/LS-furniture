/**
 * watchman.js
 * ===========
 * Catalog Maintenance Script (Phase C)
 * 
 * 1. Alerts whenever a new model is uploaded without a matching product.
 * 2. Flags products that are missing assets during the build process.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, 'public', 'products.csv');
const MODELS_DIR = path.join(ROOT, 'public', 'assets', 'models');
const PRODUCTS_JSON = path.join(ROOT, 'public', 'products.json');

function norm(s) {
    if (!s) return '';
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseCSV(content) {
    const rows = [];
    let currentLine = [];
    let currentField = '';
    let inQuote = false;
    const chars = content.replace(/\r/g, ''); 
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char === '"') { inQuote = !inQuote; continue; }
        if (char === ',' && !inQuote) { currentLine.push(currentField.trim()); currentField = ''; continue; }
        if (char === '\n' && !inQuote) { currentLine.push(currentField.trim()); rows.push(currentLine); currentLine = []; currentField = ''; continue; }
        currentField += char;
    }
    if (currentField || currentLine.length > 0) { currentLine.push(currentField.trim()); rows.push(currentLine); }
    if (rows.length === 0) return [];
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx] || ''; });
        return obj;
    }).filter(p => p.SKU);
}

async function runAudit() {
    console.log('\n🕵️  LS Lifestyle Catalog Watchman Audit');
    console.log('━'.repeat(50));

    if (!fs.existsSync(CSV_PATH)) {
        console.error('❌ Error: products.csv not found.');
        return;
    }
    if (!fs.existsSync(MODELS_DIR)) {
        console.error('❌ Error: models directory not found.');
        return;
    }

    const csvProducts = parseCSV(fs.readFileSync(CSV_PATH, 'utf8'));
    const allGlbs = fs.readdirSync(MODELS_DIR).filter(f => f.toLowerCase().endsWith('.glb'));
    const productsJson = fs.existsSync(PRODUCTS_JSON) ? JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8')) : [];

    console.log(`📊 Stats: ${csvProducts.length} CSV Rows | ${allGlbs.length} GLB Files`);

    // 1. Check for Orphaned Models (Models not in products.json as mapped)
    console.log('\n🔎 Auditing Orphaned Models...');
    const mappedModels = new Set(productsJson.map(p => path.basename(p.modelPath || '')));
    const orphans = allGlbs.filter(f => !mappedModels.has(f));

    if (orphans.length > 0) {
        console.log(`⚠️  ALERT: Found ${orphans.length} orphaned models (no product match):`);
        orphans.forEach(o => console.log(`   - ${o}`));
    } else {
        console.log('✅ No orphaned models found.');
    }

    // 2. Check for Missing Assets (Products in CSV that should have models but don't)
    console.log('\n🔎 Auditing Missing Assets...');
    const missingAssets = productsJson.filter(p => !p.hasModel);

    if (missingAssets.length > 0) {
        console.log(`🚩 FLAG: ${missingAssets.length} products are missing 3D assets:`);
        missingAssets.slice(0, 10).forEach(p => console.log(`   - [${p.SKU}] ${p['Product Name']}`));
        if (missingAssets.length > 10) console.log(`     ... and ${missingAssets.length - 10} more.`);
    } else {
        console.log('✅ All products in catalog have assets.');
    }

    console.log('\n✨ Audit Complete.');
}

runAudit();
