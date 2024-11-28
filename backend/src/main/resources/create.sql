DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS domain;
DROP TABLE IF EXISTS specialization;
DROP TABLE IF EXISTS placement;
DROP TABLE IF EXISTS user_credentials;

CREATE TABLE domain (
    domain_id INT PRIMARY KEY,
    program VARCHAR(50),
    code VARCHAR(20) NOT NULL,
    batch INT,
    capacity INT,
    qualification VARCHAR(50)
);

CREATE TABLE specialization (
    specialization_id INT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50),
    description TEXT,
    year INT,
    credits_required INT
);

CREATE TABLE placement (
    id BIGINT PRIMARY KEY,
    organisation VARCHAR(100),
    profile VARCHAR(100),
    description TEXT,
    intake INT,
    minimum_grade FLOAT
);

CREATE TABLE student (
    student_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    photograph_path VARCHAR(255),
    cgpa FLOAT,
    total_credits INT,
    graduation_year INT,
    domain INT,
    specialization INT,
    placement BIGINT
);

CREATE TABLE user_credentials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_encoded TEXT NOT NULL,
    user_type VARCHAR(255) NOT NULL
);
