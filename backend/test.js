const http = require('http');

const data = JSON.stringify({ ad: 'Test2', email: 'test2@test.com', sifre: '123456' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/kayit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(body));
});

req.write(data);
req.end();
