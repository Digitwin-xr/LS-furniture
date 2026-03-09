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
const filesInModelsDir = fs.readdirSync(modelsDir);
const filesLower = filesInModelsDir.map(f => f.toLowerCase());

let missingCount = 0;
let totalWithModel = 0;

products.forEach(p => {
    if (p.modelPath) {
        totalWithModel++;
        const relativePath = p.modelPath.replace(/^\//, ''); // remove leading slash
        const absolutePath = path.join(projectRoot, 'public', relativePath);

        if (!fs.existsSync(absolutePath)) {
            missingCount++;
            console.log(`❌ Missing: ${p.SKU} -> ${p.modelPath}`);

            // Check for case sensitivity
            const basename = path.basename(relativePath).toLowerCase();
            if (filesLower.includes(basename)) {
                const actualFile = filesInModelsDir[filesLower.indexOf(basename)];
                console.log(`   💡 Found case-insensitive match: ${actualFile}`);
            }
        }
    }
});

console.log('\n--- Diagnostic Result ---');
console.log(`Total products with modelPath: ${totalWithModel}`);
console.log(`Total missing files: ${missingCount}`);
if (missingCount === 0) {
    console.log('✅ All model paths are valid!');
}
