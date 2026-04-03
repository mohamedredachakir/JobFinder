INSERT INTO users (first_name, last_name, email, password_hash, role, is_active)
VALUES ('Demo', 'User', 'demo@jobfinder.local', '$2a$12$fM4X.rA5CUeuQbeV3a8F7u9WQ0f2SV2M4CzNQvg0Kj.Rm4lkfZn7m', 'USER', TRUE)
ON CONFLICT (email) DO NOTHING;
