const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\digit\\LS Furniture APP\\ls-lifestyle-web";
const dest = "C:\\Users\\digit\\OneDrive\\Documents\\GitHub\\LS-Furniture";

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        if (element === '.git' || element === '.next' || element === 'node_modules') return;
        const srcPath = path.join(from, element);
        const destPath = path.join(to, element);
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

console.log(`Copying from ${src} to ${dest}...`);
try {
    copyFolderSync(src, dest);
    console.log("Success!");
} catch (err) {
    console.error("Error:", err.message);
}
