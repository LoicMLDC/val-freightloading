const http = require('http');
const fs = require('fs');
const path = require('path');

// Minimal .env loader (no dependencies)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Fake DB config - no real connection is made, the API below is mocked.
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

function mockSchedule() {
  return {
    terminal: 'Terminal 4',
    gate: 'Carrier Gate Access',
    slots: [
      { slot: '06:00 - 07:00', carrier: 'Transco Freight', commodity: 'Soybean Meal', status: 'Scheduled' },
      { slot: '07:00 - 08:00', carrier: 'Nordline Carriers', commodity: 'Wheat', status: 'Scheduled' },
      { slot: '08:00 - 09:00', carrier: 'Atlas Bulk Transport', commodity: 'Corn', status: 'Pending' },
      { slot: '09:00 - 10:00', carrier: 'Meridian Logistics', commodity: 'Sunflower Oil', status: 'Scheduled' },
    ],
  };
}

function sendJson(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e4) req.destroy(); });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
          return sendJson(res, 200, { ok: true, user: username, role: 'admin' });
        }
      } catch { /* fall through */ }
      sendJson(res, 401, { ok: false, error: 'Invalid credentials' });
    });
    return;
  }
  if (url.pathname === '/api/schedule') return sendJson(res, 200, mockSchedule());

  const routes = { '/': 'index.html', '/dashboard': 'dashboard.html' };
  const filePath = path.normalize(path.join(PUBLIC_DIR, routes[url.pathname] || url.pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`${process.env.APP_NAME} running on http://localhost:${PORT}`);
  console.log(`(mock) DB: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
});
