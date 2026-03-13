const https = require('https');

const url = 'https://firebasestorage.googleapis.com/v0/b/ls-furniture-d53dd.firebasestorage.app/o/assets%2Fmodels%2F5900_juliet_daybed_sofa_can_stan.glb?alt=media';
console.log('Testing: ' + url);

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode !== 200) {
     let data = '';
     res.on('data', (c) => data += c);
     res.on('end', () => console.log('Error Data:', data));
  }
}).on('error', (err) => console.log("Error: " + err.message));
