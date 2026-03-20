DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company       VARCHAR(255) NOT NULL,
  role          VARCHAR(255) NOT NULL,
  status        VARCHAR(50) DEFAULT 'Saved',
  job_url       TEXT,
  date_applied  DATE,
  notes         TEXT,
  contact_name  VARCHAR(100),
  contact_email VARCHAR(255),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);