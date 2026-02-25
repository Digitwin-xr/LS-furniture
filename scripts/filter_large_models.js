const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\digit\\LS Furniture APP\\ls-lifestyle-web';
const srcDir = path.join(projectRoot, 'public', 'assets', 'models');
const dstDir = path.join(projectRoot, '..', 'models_deploy_temp_large');

if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
}

if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source directory ${srcDir} does not exist.`);
    process.exit(1);
}

const files = fs.readdirSync(srcDir);
let movedCount = 0;
let keptCount = 0;

files.forEach(f => {
    const srcPath = path.join(srcDir, f);
    if (fs.lstatSync(srcPath).isFile()) {
        const stats = fs.statSync(srcPath);
        const sizeMb = stats.size / (1024 * 1024);

        if (sizeMb >= 2.0) {
            const dstPath = path.join(dstDir, f);
            console.log(`Moving LARGE file: ${f} (${sizeMb.toFixed(2)} MB)`);
            fs.renameSync(srcPath, dstPath);
            movedCount++;
        } else {
            console.log(`Keeping lightweight file: ${f} (${sizeMb.toFixed(2)} MB)`);
            keptCount++;
        }
    }
});

console.log(`Summary: Moved ${movedCount} large models to ${dstDir}. Kept ${keptCount} lightweight models in ${srcDir}.`);
