# Job Application Tracker (Backend)

A Node.js + Express backend API for a job application tracking system. This repo provides secure user authentication, user-specific application management, and PostgreSQL persistence.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Setup](#project-setup)
- [Scripts](#scripts)

---

## Project Overview

This repository is the backend for the Job Application Tracker project. It exposes REST endpoints that support:

- user registration/login with hashed passwords and JWT
- authenticated CRUD operations on job applications
- request-level user authorization (each user manages only their own applications)

**Repo focus:** Backend API (no frontend in this repository).

---

## Features

- User signup and login with JWT
- Password hashing with bcrypt
- Middleware-based auth flow:
  - `getUserFromToken` reads `Authorization: Bearer <token>`
  - `requireUser` enforces authenticated access
- CRUD routes for job applications
- User-scoped data access by default
- SQL error handling for invalid input and constraint violations
- Database seeding with realistic fake data

---

## Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Runtime       | Node.js (ESM module)         |
| Web framework | Express 5                    |
| Database      | PostgreSQL                   |
| ORM / driver  | pg native client             |
| Auth          | JWT (`jsonwebtoken`), bcrypt |
| Logging       | morgan                       |
| Testing       | vitest, supertest            |
| Fixtures      | @faker-js/faker              |

---

## Architecture

```
GG-Back-End/
├── api/
│   ├── applications.js
│   └── users.js
├── db/
│   ├── client.js
│   ├── seed.js
│   ├── schema.sql
│   └── queries/
│       ├── applications.js
│       └── users.js
├── middleware/
│   ├── getUserFromToken.js
│   ├── requireBody.js
│   └── requireUser.js
├── utils/
│   └── jwt.js
├── app.js
├── server.js
├── package.json
└── README.md
```

### Core flow

1. `server.js` connects to database and starts Express app
2. `app.js` loads global middleware and routes
3. `getUserFromToken` loads user if JWT is valid
4. `requireUser` protects application routes
5. `/users` handles register/login
6. `/applications` handles user application CRUD

---

## Database Schema

This project uses a custom Postgres enum for application status.

```sql
DROP TABLE IF EXISTS applications CASCADE;
DROP TYPE IF EXISTS application_status;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(64) UNIQUE NOT NULL,
  password    VARCHAR(64) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TYPE application_status AS ENUM ('applied', 'interview', 'offer', 'rejected', 'ghosted');

CREATE TABLE applications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company       VARCHAR(32) NOT NULL,
  role          VARCHAR(32) NOT NULL,
  status        application_status DEFAULT 'applied',
  job_url       TEXT,
  date_applied  DATE,
  notes         TEXT,
  contact_name  VARCHAR(64),
  contact_email VARCHAR(64),
  followup_date DATE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Auth — `/users`

| Method | Endpoint          | Description                   | Auth Required |
| ------ | ----------------- | ----------------------------- | ------------- |
| POST   | `/users/register` | Register new user, return JWT | No            |
| POST   | `/users/login`    | Sign in, return JWT           | No            |

### Applications — `/applications` (requires auth via `Authorization: Bearer <token>`)

| Method | Endpoint                     | Description                                                |
| ------ | ---------------------------- | ---------------------------------------------------------- |
| GET    | `/applications`              | Get current user's applications                            |
| GET    | `/applications/:id`          | Get application by ID (ownership enforced)                 |
| GET    | `/applications/user/:userId` | Get applications by user ID (protected, same user allowed) |
| POST   | `/applications`              | Create application (with required fields)                  |
| PUT    | `/applications/:id`          | Update application fields                                  |
| DELETE | `/applications/:id`          | Delete application                                         |

---

## Project Setup

### Requirements

- Node.js >=22
- PostgreSQL
- `.env` with:
  - `DATABASE_URL` (e.g. `postgresql://user:pass@localhost:5432/git_ghosted`)
  - `JWT_SECRET`
  - optional `PORT` (default 3000)

### Install

```bash
npm install
```

### Database initialize

```bash
npm run db:schema
npm run db:seed
```

### Run

```bash
npm run dev
```

Server listens on `http://localhost:3000` unless `PORT` is set.

---

## Scripts

| Command             | Purpose                           |
| ------------------- | --------------------------------- |
| `npm start`         | Run production server with `.env` |
| `npm run dev`       | Run server with watch mode        |
| `npm run test`      | Run tests with vitest             |
| `npm run db:schema` | Apply schema to database          |
| `npm run db:seed`   | Seed database with sample data    |
| `npm run db:reset`  | Reset (schema + seed)             |
