const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON = path.join(process.cwd(), 'public', 'products.json');
const MODELS_DIR = path.join(process.cwd(), 'public', 'assets', 'models');

if (!fs.existsSync(PRODUCTS_JSON)) {
    console.error("products.json not found. Run stitch_bind.js first.");
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
const activeModels = new Set(
    products
        .filter(p => p.hasModel && p.NOW !== "Ask for Price")
        .map(p => path.basename(p.modelPath))
);

const allModels = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb'));
let deletedCount = 0;

allModels.forEach(model => {
    if (!activeModels.has(model)) {
        console.log(`🗑️ Deleting orphan/unoptimized model: ${model}`);
        fs.unlinkSync(path.join(MODELS_DIR, model));
        deletedCount++;
    }
});

console.log(`\n✅ Cleanup complete. Deleted ${deletedCount} models.`);
console.log(`📦 Remaining models: ${allModels.length - deletedCount}`);
