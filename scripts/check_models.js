const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('c:/Users/digit/LS Furniture APP/ls-lifestyle-web/public/products.json', 'utf8'));
const modelFiles = fs.readdirSync('c:/Users/digit/LS Furniture APP/ls-lifestyle-web/public/assets/models');

const referencedModels = new Set();
const productsWithoutModels = [];

products.forEach(p => {
    if (p.modelPath) {
        referencedModels.add(path.basename(p.modelPath));
    } else {
        productsWithoutModels.push(p["Product Name"]);
    }
});

const unreferencedModels = modelFiles.filter(file => !referencedModels.has(file));

console.log('--- PRODUCTS WITHOUT MODELS ---');
productsWithoutModels.forEach(name => console.log(name));

console.log('\n--- UNREFERENCED MODELS ---');
unreferencedModels.forEach(file => console.log(file));
