const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\digit\\LS Furniture APP\\models_deploy_temp';
const dstDir = 'c:\\Users\\digit\\LS Furniture APP\\ls-lifestyle-web\\public\\assets\\models';

if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
let movedCount = 0;

files.forEach(f => {
    const srcPath = path.join(srcDir, f);
    if (fs.lstatSync(srcPath).isFile()) {
        const stats = fs.statSync(srcPath);
        const sizeMb = stats.size / (1024 * 1024);
        if (sizeMb < 2.0) {
            const dstPath = path.join(dstDir, f);
            console.log(`Moving ${f} (${sizeMb.toFixed(2)} MB)`);
            fs.renameSync(srcPath, dstPath);
            movedCount++;
        }
    }
});

console.log(`Successfully moved ${movedCount} lightweight models.`);
