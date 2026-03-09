/**
 * model_matcher_server.js
 * =======================
 * Local server that serves the visual model matching tool.
 * It serves GLB models, catalogue images, and the matcher HTML page.
 *
 * Run: node scripts/model_matcher_server.js
 * Then open: http://localhost:3040
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3040;
const ROOT = path.resolve(__dirname, '..');
const PARENT_DIR = path.resolve(ROOT, '..');
const MODELS_DIR = path.join(ROOT, 'public', 'assets', 'models');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SCRIPTS_DIR = __dirname;
const MAPPING_FILE = path.join(SCRIPTS_DIR, 'model_mapping.json');
const CSV_PATH = path.join(PUBLIC_DIR, 'products.csv');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.glb': 'model/gltf-binary',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
};

function parseCSV(content) {
    const lines = content.replace(/\r/g, '').split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const parts = [];
        let current = '';
        let inQuote = false;
        for (const ch of lines[i]) {
            if (ch === '"') { inQuote = !inQuote; continue; }
            if (ch === ',' && !inQuote) { parts.push(current.trim()); current = ''; continue; }
            current += ch;
        }
        parts.push(current.trim());
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = parts[idx] || ''; });
        if (obj.SKU) rows.push(obj);
    }
    return rows;
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsed.pathname);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API: List unnamed models
    if (pathname === '/api/models') {
        const allGlbs = fs.readdirSync(MODELS_DIR)
            .filter(f => f.toLowerCase().endsWith('.glb') && f.toLowerCase().startsWith('object_0'));
        const models = allGlbs.map(f => {
            const stats = fs.statSync(path.join(MODELS_DIR, f));
            return {
                filename: f,
                sizeMB: parseFloat((stats.size / (1024 * 1024)).toFixed(2)),
                modified: stats.mtime.toISOString(),
            };
        }).sort((a, b) => a.filename.localeCompare(b.filename));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(models));
        return;
    }

    // API: List products from CSV
    if (pathname === '/api/products') {
        const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
        const products = parseCSV(csvContent);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
        return;
    }

    // API: List catalogue images (from parent LS Furniture APP dir)
    if (pathname === '/api/catalogue-images') {
        const images = fs.readdirSync(PARENT_DIR)
            .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
            .sort();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(images));
        return;
    }

    // API: Get/Save mapping
    if (pathname === '/api/mapping') {
        if (req.method === 'GET') {
            if (fs.existsSync(MAPPING_FILE)) {
                const data = fs.readFileSync(MAPPING_FILE, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('{}');
            }
            return;
        }
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const mapping = JSON.parse(body);
                    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, count: Object.keys(mapping).length }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: e.message }));
                }
            });
            return;
        }
    }

    // API: Execute rename based on mapping
    if (pathname === '/api/execute-rename' && req.method === 'POST') {
        if (!fs.existsSync(MAPPING_FILE)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No mapping file found' }));
            return;
        }
        const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
        const results = [];
        for (const [oldName, productInfo] of Object.entries(mapping)) {
            if (!productInfo || !productInfo.newFilename) continue;
            const oldPath = path.join(MODELS_DIR, oldName);
            const newPath = path.join(MODELS_DIR, productInfo.newFilename);
            if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
                fs.renameSync(oldPath, newPath);
                results.push({ old: oldName, new: productInfo.newFilename, status: 'renamed' });
            } else if (!fs.existsSync(oldPath)) {
                results.push({ old: oldName, new: productInfo.newFilename, status: 'source_missing' });
            } else {
                results.push({ old: oldName, new: productInfo.newFilename, status: 'dest_exists' });
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results }));
        return;
    }

    // Serve static files
    let filePath = '';
    if (pathname === '/' || pathname === '/index.html') {
        filePath = path.join(SCRIPTS_DIR, 'model_matcher.html');
    } else if (pathname.startsWith('/models/')) {
        filePath = path.join(MODELS_DIR, pathname.slice(8));
    } else if (pathname.startsWith('/catalogue/')) {
        filePath = path.join(PARENT_DIR, pathname.slice(11));
    } else if (pathname.startsWith('/images/')) {
        filePath = path.join(PUBLIC_DIR, pathname.slice(8));
    } else if (pathname.startsWith('/scripts/')) {
        filePath = path.join(SCRIPTS_DIR, pathname.slice(9));
    } else {
        filePath = path.join(PUBLIC_DIR, pathname.slice(1));
    }

    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not Found: ' + pathname);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Stream large files (GLBs)
    if (ext === '.glb' || ext === '.pdf') {
        const stat = fs.statSync(filePath);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stat.size,
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading file');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }
});

server.listen(PORT, () => {
    console.log(`\n🔧 Model Matcher Server running at http://localhost:${PORT}/`);
    console.log(`📂 Models: ${MODELS_DIR}`);
    console.log(`📸 Catalogue: ${PUBLIC_DIR}`);
    console.log(`💾 Mapping: ${MAPPING_FILE}\n`);
});
