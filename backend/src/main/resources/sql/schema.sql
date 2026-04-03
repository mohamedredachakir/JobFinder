CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER',
  is_active BOOLEAN DEFAULT FALSE,
  cv_url VARCHAR(500),
  preferred_location VARCHAR(255),
  preferred_sector VARCHAR(255),
  preferred_salary NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id VARCHAR(255) NOT NULL,
  job_data JSONB NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id VARCHAR(255) NOT NULL,
  job_data JSONB NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  applied_at TIMESTAMP,
  interview_date TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keywords VARCHAR(500) NOT NULL,
  location VARCHAR(255),
  contract_type VARCHAR(100),
  min_salary NUMERIC(10,2),
  frequency VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
