const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\digit\\LS Furniture APP\\ls-lifestyle-web';
const srcDir = path.join(projectRoot, '..', 'models_deploy_temp_large');
const dstDir = path.join(projectRoot, 'public', 'assets', 'models');

if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    files.forEach(f => {
        const srcPath = path.join(srcDir, f);
        const dstPath = path.join(dstDir, f);
        console.log(`Moving: ${f}`);
        fs.renameSync(srcPath, dstPath);
    });
    console.log('Successfully merged large models back to public/assets/models.');
} else {
    console.log('Source directory not found, skipping merge.');
}
