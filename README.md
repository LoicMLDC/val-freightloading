# Freight Loading Dashboard (VAL)

Internal dashboard for monitoring freight loading operations.

- **URL:** https://val-freightloading.ldc.com
- **Environment:** VAL (validation)

## Admin account

| Username | Password |
|----------|----------|
| admin    | admin    |

This account is hardcoded in `server.js` and bypasses the database entirely.

## Database

The site uses a PostgreSQL instance (credentials in `.env`):

- Host: `val-freightloading-db.ldc.com:5432`
- Database: `freightloading_val`
- User: `fl_app_user`

All other accounts are validated against the `users` table (seeded in `db.js`):

| Username     | Password        | Role     |
|--------------|-----------------|----------|
| operator1    | L0ading#Ops19   | operator |
| dispatcher   | D1spatch2026!   | operator |
| jsmith       | Harvest!22Fl    | viewer   |

## Run locally

```bash
node server.js
```

Then open http://localhost:3000.

The API is mocked in `server.js`. `db.js` simulates the `users` table lookup (no real database connection is made).

## API endpoints (mocked)

| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| POST   | /api/login         | Authenticate user        |
| GET    | /api/schedule      | Today's loading schedule |

Dashboard: https://val-freightloading.ldc.com/dashboard
