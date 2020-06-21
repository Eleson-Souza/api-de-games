CREATE DATABASE db_api;

USE db_api;

CREATE TABLE `games`(
	`id` INTEGER PRIMARY KEY AUTO_INCREMENT,
	`title` VARCHAR(50),
    `year` INTEGER,
    `price` DECIMAL,
    `createdAt` DATETIME,
    `updatedAt` DATETIME
);

CREATE TABLE `users`(
	`id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) null,
    `email` VARCHAR(50) null,
    `password` VARCHAR(50) null,
    `createdAt` DATETIME null,
    `updatedAt` DATETIME null
);

INSERT INTO `users` (`name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
('eleson', 'elesonsouza@outlook.com', 'JKHDJKHAUIA', curdate(), curdate());
