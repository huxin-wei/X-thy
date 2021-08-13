show databases;

create database if not exists music_teacher;

use music_teacher;

create table if not exists lesson(
	lesson_id int primary key auto_increment,
    lesson_name varchar(70) not null,
    description varchar(500),
    duration int not null,
    price decimal(13,2) not null,
    status ENUM('active', 'inactive','deleted') not null
);

create table if not exists availability(
	availability_id int primary key auto_increment,
    days varchar(7) not null,
    minute_start int not null,
    minute_end int not null,
    status ENUM('active', 'inactive', 'deleted') not null
);

create table if not exists upload(
	file_id int primary key auto_increment,
    file_name varchar(50),
    file_extension varchar(5),
    file_location varchar(255) not null
);

