const http = require('http');
const data = JSON.stringify({
  class_name: 'class 1',
  section: 'A',
  grade: '11',
  roomNumber: '12',
  capacity: 34,
  teacherId: 'afdf2f78-3ef1-4eae-b7e3-2cb8f8379d67'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/classes',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => { console.log('Body:', body); });
});

req.on('error', err => {
  console.error('Request error:', err.message);
});

req.write(data);
req.end();
