const fs = require('fs');
const https = require('https');
const path = require('path');

const LOCAL_PATH = path.join(__dirname, '..', 'public', 'products.json');
const LIVE_URL = 'https://ls-furniture.vercel.app/products.json';

function fetchLive(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Failed to parse live JSON: ${e.message}`));
                }
            });
        }).on('error', reject);
    });
}

async function diagnose() {
    try {
        console.log('--- DIAGNOSIS REPORT ---');
        
        if (!fs.existsSync(LOCAL_PATH)) {
            throw new Error(`Local file not found: ${LOCAL_PATH}`);
        }
        
        const localData = JSON.parse(fs.readFileSync(LOCAL_PATH, 'utf8'));
        const liveData = await fetchLive(LIVE_URL);

        console.log(`Local Products: ${localData.length}`);
        console.log(`Live Products:  ${liveData.length}`);
        
        const localWithModels = localData.filter(p => p.modelPath).length;
        const liveWithModels = liveData.filter(p => p.modelPath).length;
        
        console.log(`Local with 3D:  ${localWithModels}`);
        console.log(`Live with 3D:   ${liveWithModels}`);

        // Sample check with flexible type
        const sampleSku = '5900';
        const localSample = localData.find(p => String(p.sku) === sampleSku);
        const liveSample = liveData.find(p => String(p.sku) === sampleSku);
        
        console.log(`\nSample SKU ${sampleSku} modelPath:`);
        console.log(`  Local: ${localSample?.modelPath || 'N/A'}`);
        console.log(`  Live:  ${liveSample?.modelPath || 'N/A'}`);
        
        // Find one that IS local but NOT live
        const localMissingFromLive = localData.filter(lp => !liveData.find(rp => String(rp.sku) === String(lp.sku)));
        console.log(`\nProducts Local but MISSING from Live: ${localMissingFromLive.length}`);
        if (localMissingFromLive.length > 0) {
            console.log('First 3 missing SKUs:', localMissingFromLive.slice(0, 3).map(p => p.sku).join(', '));
        }

    } catch (e) {
        console.error('Error during diagnosis:', e.message);
    }
}

diagnose();
