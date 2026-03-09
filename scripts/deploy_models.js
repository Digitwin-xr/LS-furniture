const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GIT = "C:\\Users\\digit\\AppData\\Local\\GitHubDesktop\\app-3.5.5\\resources\\app\\git\\cmd\\git.exe";
const MODELS_DIR = path.join(process.cwd(), 'public', 'assets', 'models');

const models = fs.readdirSync(MODELS_DIR)
    .filter(f => f.endsWith('.glb'));

console.log(`🚀 Found ${models.length} models to check.`);

for (let i = 0; i < models.length; i++) {
    const file = models[i];
    console.log(`📦 Model ${i + 1} / ${models.length}: ${file}`);

    try {
        const relPath = `public/assets/models/${file}`;
        execSync(`"${GIT}" add --force "${relPath}"`);

        const staged = execSync(`"${GIT}" status --porcelain`).toString().trim();
        const isStaged = staged.split('\n').some(line => {
            return (line.startsWith('A ') || line.startsWith('M ')) && line.includes(file);
        });

        if (isStaged) {
            console.log(`📝 Changes detected. Committing...`);
            execSync(`"${GIT}" commit -m "assets: add model ${file}"`);

            console.log(`⬆️ Pushing ${file}...`);
            execSync(`"${GIT}" push origin main`, { stdio: 'inherit' });
            console.log(`🚀 ${file} pushed successfully.`);
        } else {
            // Not staged for commit, but maybe it was already committed in a previous failed push attempt?
            // If it's in origin/main..HEAD, we still need to push.
            // But if it's not even modified, skip.
        }

    } catch (e) {
        if (e.message && e.message.includes('nothing to commit')) {
            // do nothing
        } else {
            console.error(`❌ Error with ${file}:`, e.message);
            // Don't stop for now, try next one? Or stop if push fails?
            // If push fails, it's likely a network issue. Let's stop.
            process.exit(1);
        }
    }
}

console.log(`✨ All models checked and synced.`);
