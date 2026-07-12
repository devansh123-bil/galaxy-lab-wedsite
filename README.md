# MyStoreWebsite

A complete responsive e-commerce website built with React + Vite, Node.js + Express, and MySQL.

## Features

- Premium responsive storefront with animated product cards
- Product listing, details page, search, and category filters
- Order form with database persistence
- Automatic Gmail SMTP order email notifications
- Admin login with JWT
- Admin product CRUD with image uploads, category, stock, price, and description
- Admin order management page
- MySQL database and tables are created automatically
- SQL injection protection through parameterized queries
- XSS risk reduction through React escaping, server-side sanitization, Helmet, and strict upload limits
- Secrets stored in `.env`

## Requirements

- Node.js 18+
- MySQL 8+
- A Gmail account with an App Password for SMTP

## Setup

1. Install dependencies:

```bash
npm run install:all
npm install
```

2. Create the backend environment file:

```bash
copy backend\.env.example backend\.env
```

3. Edit `backend/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mystore

JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_TO=yourgmail@gmail.com
```

4. Create the frontend environment file:

```bash
copy frontend\.env.example frontend\.env
```

5. Run both apps:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

## Admin Panel

Open http://localhost:5173/admin and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`.

## Gmail SMTP Notes

Gmail requires a Google App Password. Enable 2-Step Verification on your Google account, create an app password, and use that value as `SMTP_PASS`.

## Production Notes

- Use a strong `JWT_SECRET`.
- Serve the frontend build through a production web server or CDN.
- Restrict CORS `FRONTEND_URL` to the production domain.
- Keep `backend/.env` private and never commit it.
