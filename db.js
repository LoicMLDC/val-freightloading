const crypto = require('crypto');

// Fake connection pool - mimics a `pg` Pool but never opens a real socket.
const pool = {
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
  },
};

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Seed data standing in for the `users` table (passwords stored as sha256 hashes).
const users = [
  { id: 1, username: 'operator1', password_hash: sha256('L0ading#Ops19'), role: 'operator' },
  { id: 2, username: 'dispatcher', password_hash: sha256('D1spatch2026!'), role: 'operator' },
  { id: 3, username: 'jsmith', password_hash: sha256('Harvest!22Fl'), role: 'viewer' },
];

async function query(sql, params = []) {
  if (/^SELECT .* FROM users WHERE username/i.test(sql)) {
    const [username] = params;
    return { rows: users.filter((u) => u.username === username) };
  }
  return { rows: [] };
}

function verifyPassword(plainPassword, hash) {
  return sha256(plainPassword) === hash;
}

module.exports = { pool, query, verifyPassword };
