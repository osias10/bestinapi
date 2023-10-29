
CREATE DATABASE biosDB;
USE biosDB;

CREATE TABLE user (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dong VARCHAR(50) NOT NULL,
    ho VARCHAR(50) NOT NULL,
    user_password VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    tel VARCHAR(25),
    user_state INT(11) DEFAULT 0,
    expire_date DATETIME,
    rdate DATETIME,
    UNIQUE KEY unique_key (`dong`, `ho`, `email`)
);