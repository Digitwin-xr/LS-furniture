const { list } = require('@vercel/blob');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    console.log('Success! Found ' + blobs.length + ' blobs.');
  } catch (e) {
    console.error('Failed: ' + e.message);
  }
}

test();
