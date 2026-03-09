const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const productsJsonPath = path.join(projectRoot, 'public', 'products.json');
const modelsDir = path.join(projectRoot, 'public', 'assets', 'models');

if (!fs.existsSync(productsJsonPath)) {
    console.error('❌ products.json not found');
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

let updatedCount = 0;

const updatedProducts = products.map(p => {
    if (p.modelPath) {
        const relativePath = p.modelPath.replace(/^\//, '');
        const absolutePath = path.join(projectRoot, 'public', relativePath);

        if (!fs.existsSync(absolutePath)) {
            updatedCount++;
            return {
                ...p,
                hasModel: false,
                modelPath: null // Optional: remove path if file is gone
            };
        }
    }
    return p;
});

fs.writeFileSync(productsJsonPath, JSON.stringify(updatedProducts, null, 2));

console.log(`✅ Updated ${updatedCount} products to set hasModel: false due to missing files.`);
