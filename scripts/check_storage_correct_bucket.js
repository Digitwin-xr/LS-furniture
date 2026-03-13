const https = require('https');

https.get('https://firebasestorage.googleapis.com/v0/b/ls-furniture-d53dd.firebasestorage.app/o?prefix=models%2F&maxResults=10', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
     try {
       const parsed = JSON.parse(data);
       if (parsed.items) {
          console.log(parsed.items.map(i => i.name));
       } else {
          console.log(parsed);
       }
     } catch (e) {
       console.log(data.substring(0, 1000));
     }
  });
}).on('error', (err) => console.log("Error: " + err.message));
