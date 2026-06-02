CREATE DATABASE crime_management;
USE crime_management;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE crimes (
    crime_id INT AUTO_INCREMENT PRIMARY KEY,
    crime_type VARCHAR(100),
    location VARCHAR(200),
    description TEXT,
    crime_date DATE,
    status VARCHAR(50)
);
