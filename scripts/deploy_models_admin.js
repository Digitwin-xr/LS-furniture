const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize the app with application default credentials
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'ls-furniture-d53dd.firebasestorage.app'
});

const bucket = admin.storage().bucket();
const MODELS_DIR = path.join(__dirname, '..', 'public', 'assets', 'models');

async function uploadModels() {
  const files = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb'));
  console.log(`Found ${files.length} models to upload.`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const localPath = path.join(MODELS_DIR, file);
    const destination = `assets/models/${file}`;

    console.log(`[${i+1}/${files.length}] Checking/Uploading ${file}...`);
    
    try {
      // Check if exists first to save bandwidth
      const [exists] = await bucket.file(destination).exists();
      if (exists) {
        console.log(` -> Already exists: ${destination}`);
        continue;
      }

      await bucket.upload(localPath, {
        destination,
        metadata: {
          contentType: 'model/gltf-binary', // IMPORTANT FOR 3D MODELS
          cacheControl: 'public, max-age=31536000'
        }
      });
      console.log(` -> Successfully uploaded: ${destination}`);
    } catch (error) {
      console.error(` -> Failed to upload ${file}:`, error);
    }
  }
}

uploadModels().then(() => {
  console.log('Upload process finished.');
  process.exit(0);
}).catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
