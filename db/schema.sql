DROP TABLE IF EXISTS applications CASCADE;
DROP TYPE IF EXISTS application_status;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(64) UNIQUE NOT NULL,
  password    VARCHAR(64) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TYPE application_status AS ENUM ('applied', 'interviewed', 'offered', 'rejected', 'ghosted');

-- Applications table
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
