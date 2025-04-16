CREATE DATABASE salinity_monitoring;

USE salinity_monitoring;

CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(50) NOT NULL,
    salinity FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
