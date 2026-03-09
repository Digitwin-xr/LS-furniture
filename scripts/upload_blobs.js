const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const token = process.env.BLOB_READ_WRITE_TOKEN;
const MODELS_DIR = path.join(process.cwd(), 'public', 'assets', 'models');
const PRODUCTS_JSON = path.join(process.cwd(), 'public', 'products.json');

async function uploadModels() {
    if (!token) {
        console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env.local');
        return;
    }

    const files = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb'));
    const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
    let updatedCount = 0;

    console.log(`🚀 Starting batch upload of ${files.length} models...`);

    for (const file of files) {
        try {
            const filePath = path.join(MODELS_DIR, file);
            const fileBuffer = fs.readFileSync(filePath);

            console.log(`⬆️ Uploading ${file} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)...`);

            // Add a timeout wrapper for individual uploads if possible
            const blob = await put(file, fileBuffer, {
                access: 'public',
                addRandomSuffix: false,
                token: token
            });

            console.log(`✅ Success: ${blob.url}`);

            let matched = false;
            products.forEach(p => {
                if (p.glbFile === file || p.modelPath?.endsWith(file)) {
                    p.modelPath = blob.url;
                    matched = true;
                    updatedCount++;
                }
            });

            if (!matched) {
                console.warn(`⚠️ Warning: No product SKU matched for model ${file}`);
            }

            // Save after EACH successful upload to prevent data loss if it crashes
            fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2));

        } catch (error) {
            console.error(`❌ Error uploading ${file}:`, error.message);
            // Don't stop the whole process for one failure
            continue;
        }
    }

    console.log(`✨ Finished! Final sync done. Updated ${updatedCount} product entries.`);
}

uploadModels().catch(err => {
    console.error('💥 Fatal script error:', err);
    process.exit(1);
});
