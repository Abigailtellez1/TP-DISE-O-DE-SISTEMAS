-- Ensure users table exists for single-table inheritance (students/landlords)
CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(16) NOT NULL,
    preferred_bedrooms INTEGER
);
