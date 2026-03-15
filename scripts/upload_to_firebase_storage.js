const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// 1. Initialise Storage
// If you download a Service Account JSON, put its path here: e.g., 'firebase-key.json'
const SERVICE_ACCOUNT_KEY = 'firebase-key.json'; 

const storageOptions = SERVICE_ACCOUNT_KEY ? { keyFilename: SERVICE_ACCOUNT_KEY } : {};
const storage = new Storage(storageOptions);

const BUCKET_NAME = 'ls-furniture-d53dd.firebasestorage.app';
const LOCAL_MODELS_DIR = path.join(__dirname, '../public/assets/models');
const REMOTE_MODELS_DIR = 'assets/models';

async function uploadModels() {
    try {
        console.log('🔍 Checking credentials...');
        // Try to identify who we are
        try {
            const [metadata] = await storage.getServiceAccount();
            console.log(`👤 Authenticated as: ${metadata.email || 'Unknown'}`);
        } catch (e) {
            console.log('⚠️ Could not verify account email, proceeding with default...');
        }

        if (!fs.existsSync(LOCAL_MODELS_DIR)) {
            console.error(`❌ Local models directory not found: ${LOCAL_MODELS_DIR}`);
            return;
        }

        const files = fs.readdirSync(LOCAL_MODELS_DIR).filter(file => file.endsWith('.glb'));
        console.log(`🚀 Found ${files.length} models for Firebase Storage...`);

        const bucket = storage.bucket(BUCKET_NAME);

        // Check bucket access early
        const [exists] = await bucket.exists();
        if (!exists) {
            throw new Error(`Bucket ${BUCKET_NAME} does not exist. Please click "Get Started" in the Storage tab of Firebase Console.`);
        }

        for (const file of files) {
            const localFilePath = path.join(LOCAL_MODELS_DIR, file);
            const remoteFilePath = `${REMOTE_MODELS_DIR}/${file}`;

            console.log(`⬆️ Uploading ${file}...`);
            await bucket.upload(localFilePath, {
                destination: remoteFilePath,
                metadata: {
                    contentType: 'model/gltf-binary',
                },
            });
        }

        console.log('\n✅ All models uploaded to Firebase Storage successfully!');
    } catch (error) {
        console.error('\n❌ Failed to upload models:');
        console.error(error); // Logging the whole object is better than JSON.stringify for Errors
        if (error.message) console.error(`Message: ${error.message}`);
        if (error.stack) console.error(`Stack: ${error.stack}`);
        
        console.log('\n--- HOW TO FIX THIS ---');
        console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts.');
        console.log('2. Click "Generate new private key" and download the JSON.');
        console.log('3. Save it as "firebase-key.json" in this folder.');
        console.log('4. Edit this script to set SERVICE_ACCOUNT_KEY = "firebase-key.json".');
    }
}

uploadModels();

