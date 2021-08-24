show databases;

create database if not exists music_teacher;

use music_teacher;

create table if not exists lesson(
	lesson_id int primary key auto_increment,
    lesson_name varchar(70) not null,
    description varchar(500),
    price_30m decimal(13,2) not null,
	price_60m decimal(13,2) not null,
    status ENUM('active', 'inactive','deleted') not null
);

create table if not exists availability(
	availability_id int primary key auto_increment,
    days varchar(7) not null,
    start_minute int not null,
    end_minute int not null,
    status ENUM('active', 'inactive', 'deleted') not null
);

create table if not exists appointment(
	appointment_id int primary key auto_increment,
    customer_name varchar(50) not null,
    customer_email varchar(50) not null,
    customer_phone varchar(20),
    note varchar(255),
    appointment_start timestamp not null,
    appointment_end timestamp not null,
	duration int not null,
    lesson_id int not null,
    total_fee int not null,
    appointmnet_cancel_code varchar(50) not null,
    appointmnet_status ENUM('active', 'inactive', 'owner-cancelled', 'booker-cancelled') not null
);

create table if not exists app(
	appointment_start timestamp not null,
    appointment_end timestamp not null
);

insert into app values('2021-08-21 8:30', '2021-08-21 9:00');
insert into app values('2021-08-21 9:00', '2021-08-21 11:30');
insert into app values('2021-08-21 13:30', '2021-08-21 14:30');

alter table app add status varchar(10) first;
update app set status = 'active';

select * from app;
select * from availability;
select * from  lesson;
delete from availability where availability_id > 5;
update availability set days = '1234';

ALTER TABLE availability CHANGE minute_start start_minute int;
ALTER TABLE availability CHANGE minute_end end_minute int;
ALTER TABLE lesson CHANGE 'sdsds' description varchar(500);

select * from app where datediff('2021-08-21T12:33:17.000Z', appointment_start) = 0;

select * 
from availability, (select appointment_start, appointment_end)
where availability.days like '0' ;


insert into upload(file_name, file_extension, file_location) values('cat', 'png', 'unknown');

select * from lesson;
delete from lesson;
describe lesson;

select * from availability;
create table if not exists upload2(
    file_name varchar(50),
    file_extension varchar(5),
    file_location varchar(255) not null
);

select * from upload;

-- A solution to insert appointmnet record
INSERT INTO upload (file_name, file_extension, file_location)
SELECT 'thefile_2' as file_name, 'png' as file_extension, 'somewhere' as file_location
FROM upload
WHERE (file_name='thefile_3' and file_extension='png')
HAVING COUNT(*) = 0;

-- https://stackoverflow.com/questions/913841/mysql-conditional-insert
