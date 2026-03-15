const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'ls-furniture-d53dd.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function configureCors() {
  await bucket.setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: ['GET', 'HEAD'],
      origin: ['*'],
      responseHeader: ['Content-Type'],
    },
  ]);
  console.log('CORS configured successfully.');
}

configureCors().catch(console.error);
