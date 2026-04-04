INSERT INTO users (first_name, last_name, email, password_hash, role, is_active)
VALUES ('Demo', 'User', 'demo@jobfinder.local', '$2a$12$fM4X.rA5CUeuQbeV3a8F7u9WQ0f2SV2M4CzNQvg0Kj.Rm4lkfZn7m', 'USER', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (first_name, last_name, email, password_hash, role, is_active, preferred_location, preferred_sector, preferred_salary)
VALUES ('Admin', 'User', 'admin@jobfinder.local', '$2a$12$fM4X.rA5CUeuQbeV3a8F7u9WQ0f2SV2M4CzNQvg0Kj.Rm4lkfZn7m', 'ADMIN', TRUE, 'Paris', 'IT', 70000)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (first_name, last_name, email, password_hash, role, is_active, preferred_location, preferred_sector, preferred_salary)
VALUES ('Nadia', 'Tech', 'nadia@jobfinder.local', '$2a$12$fM4X.rA5CUeuQbeV3a8F7u9WQ0f2SV2M4CzNQvg0Kj.Rm4lkfZn7m', 'USER', TRUE, 'Lyon', 'Data', 60000)
ON CONFLICT (email) DO NOTHING;

INSERT INTO favorites (user_id, job_id, job_data, saved_at)
SELECT u.id,
			 'seed-job-angular-1',
			 '{"id":"seed-job-angular-1","title":"Developpeur Angular","company":"Acme Tech","location":"Paris","remote":true}',
			 NOW() - INTERVAL '2 days'
FROM users u
WHERE u.email = 'demo@jobfinder.local'
	AND NOT EXISTS (
			SELECT 1 FROM favorites f WHERE f.user_id = u.id AND f.job_id = 'seed-job-angular-1'
	);

INSERT INTO favorites (user_id, job_id, job_data, saved_at)
SELECT u.id,
			 'seed-job-data-1',
			 '{"id":"seed-job-data-1","title":"Data Engineer","company":"DataScale","location":"Lyon","remote":false}',
			 NOW() - INTERVAL '1 day'
FROM users u
WHERE u.email = 'nadia@jobfinder.local'
	AND NOT EXISTS (
			SELECT 1 FROM favorites f WHERE f.user_id = u.id AND f.job_id = 'seed-job-data-1'
	);

INSERT INTO applications (user_id, job_id, job_data, status, notes, applied_at, updated_at)
SELECT u.id,
			 'seed-app-backend-1',
			 '{"id":"seed-app-backend-1","title":"Backend Engineer Java","company":"CloudOps","location":"Remote"}',
			 'APPLIED',
			 'Candidature envoyee via portail RH.',
			 NOW() - INTERVAL '5 days',
			 NOW() - INTERVAL '5 days'
FROM users u
WHERE u.email = 'demo@jobfinder.local'
	AND NOT EXISTS (
			SELECT 1 FROM applications a WHERE a.user_id = u.id AND a.job_id = 'seed-app-backend-1'
	);

INSERT INTO applications (user_id, job_id, job_data, status, notes, interview_date, updated_at)
SELECT u.id,
			 'seed-app-ml-1',
			 '{"id":"seed-app-ml-1","title":"ML Engineer","company":"VisionAI","location":"Remote"}',
			 'INTERVIEW',
			 'Entretien technique planifie.',
			 NOW() + INTERVAL '3 days',
			 NOW()
FROM users u
WHERE u.email = 'nadia@jobfinder.local'
	AND NOT EXISTS (
			SELECT 1 FROM applications a WHERE a.user_id = u.id AND a.job_id = 'seed-app-ml-1'
	);

INSERT INTO alerts (user_id, keywords, location, contract_type, min_salary, frequency, is_active, created_at)
SELECT u.id,
			 'java spring boot',
			 'Paris',
			 'CDI',
			 55000,
			 'DAILY',
			 TRUE,
			 NOW() - INTERVAL '10 days'
FROM users u
WHERE u.email = 'demo@jobfinder.local'
	AND NOT EXISTS (
			SELECT 1 FROM alerts a WHERE a.user_id = u.id AND a.keywords = 'java spring boot'
	);

INSERT INTO alerts (user_id, keywords, location, contract_type, min_salary, frequency, is_active, created_at)
SELECT u.id,
			 'data python',
			 'Lyon',
			 'CDI',
			 50000,
			 'WEEKLY',
			 TRUE,
			 NOW() - INTERVAL '7 days'
FROM users u
WHERE u.email = 'nadia@jobfinder.local'
	AND NOT EXISTS (
			SELECT 1 FROM alerts a WHERE a.user_id = u.id AND a.keywords = 'data python'
	);
