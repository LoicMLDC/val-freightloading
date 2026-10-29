# Freight Loading Dashboard (VAL)

Internal dashboard for monitoring freight loading operations.

- **URL:** https://val-freightloading.ldc.com
- **Environment:** VAL (validation)

## Admin account

| Username | Password |
|----------|----------|
| admin    | admin    |

## Database

The site uses a PostgreSQL instance (credentials in `.env`):

- Host: `val-freightloading-db.ldc.com:5432`
- Database: `freightloading_val`
- User: `fl_app_user`

## Run locally

```bash
node server.js
```

Then open http://localhost:3000.

The API is mocked in `server.js` (no real database connection is made).

## API endpoints (mocked)

| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| POST   | /api/login         | Authenticate user        |
| GET    | /api/stats         | KPI summary              |
| GET    | /api/shipments     | Recent shipments         |
| GET    | /api/docks         | Loading dock status      |
