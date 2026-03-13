const https = require('https');

https.get('https://firebasestorage.googleapis.com/v0/b/ls-furniture-d53dd.appspot.com/o?maxResults=10', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log(data));
}).on('error', (err) => console.log("Error: " + err.message));
