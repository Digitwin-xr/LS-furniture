const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const token = process.env.BLOB_READ_WRITE_TOKEN;

async function testUpload() {
    console.log('🧪 Testing minimal Vercel Blob upload...');
    console.log('Token exists:', !!token);

    try {
        const result = await put('test-connection.txt', 'Hello Vercel Blob!', {
            access: 'public',
            token: token
        });
        console.log('✅ Success! Uploaded to:', result.url);
    } catch (err) {
        console.error('❌ Upload failed:', err.message);
    }
}

testUpload();
