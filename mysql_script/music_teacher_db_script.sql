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
    end_minute int not null
);

create table if not exists booking(
	appointment_id int primary key auto_increment,
    booking_date timestamp not null,
    customer_name varchar(50) not null,
    customer_email varchar(50) not null,
    customer_phone varchar(20),
    note varchar(255),
    appointment_start timestamp,
    appointment_end timestamp,
	duration int not null,
    lesson_id int not null,
    fee int,
    appointment_cancel_code varchar(50) not null,
    update_date timestamp,
    status ENUM('active', 'admin_cancelled', 'booker_cancelled', 'cancelled') not null
);
select * from booking;
show tables;
delete from booking;

select * from availability;
describe booking;
drop table booking;

create table testtime(
	thetime timestamp
);

select now();

insert into testtime( select now());
insert into testtime values( '2021-09-10 18:00:00');
select * from testtime;

create table if not exists user(
	id int primary key auto_increment,
    email varchar(50) unique not null,
    password varchar(60) not null
);

insert into user (email, password) values ('mcjordanguitar@gmail.com', '$2b$10$BaK6v4DiXSFY91T.xX2SuOUtFsxVezX5fUL1qL44EcfIGpWcwQv/i');

select * from user;

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
WHERE (file_name='thefile_2' and file_extension='mop')
HAVING COUNT(*) = 0;

-- insert into booking (customer_name, customer_email, customer_phone, 
--       note, appointment_start, appointment_end, duration, lesson_id, fee, 
--       appointment_cancel_code, status) 
--       select 'value1', 'value2', 'value3', 'value4', 'value5', 'value6', 'value7', 'value8', 'value9', 'value10', 'value11', 'value12'
--       from booking
-- );

select * from booking;
SELECT * 
FROM booking
where datediff(?, appointmnet_start) = 0 AND
	(s >= appointment_start AND s < appointment_end) OR
    (e > appointment_start AND e <= appointment_end)
    ;
    
SELECT * 
FROM booking
where datediff('2021-08-28 13:00:00', appointment_start) = 0 AND
	('2021-08-28 13:00:00' >= appointment_start AND '2021-08-28 13:00:00' < appointment_end) OR
    ('2021-08-28 13:30:00' > appointment_start AND '2021-08-28 13:30:00' <= appointment_end)
    LIMIT 1
    ;

select * from lesson where exists 
(SELECT 1
FROM availability
WHERE days like '%0%' AND 1000>= start_minute AND 1200 <= end_minute) AND 2> 1 ;

delete from booking;

select * from booking;
-- Finish query
insert into booking (customer_name, customer_email, customer_phone, note, appointment_start, appointment_end, duration, lesson_id, fee, appointment_cancel_code, status) 
select 'myname','kaimaa@gmail.com', '', '', '2021-08-28 13:30:00', '2021-08-28 15:30:00', 120, 186, 500, 'fjjewofjpreker;jhsdjfioj849I4TGKISJO', 'active'
where exists (select * from availability where days like '%0%') and exists (select * from availability where days like '%9%')
;
insert into booking (customer_name, customer_email, customer_phone, 
      note, appointment_start, appointment_end, duration, lesson_id, fee, 
      appointment_cancel_code, status) 
select 'myname','kaimaa@gmail.com', '', '', '2021-08-28 13:30:00', '2021-08-28 15:30:00', 120, 186, 500, 'fjjewofjpreker;jhsdjfioj849I4TGKISJO', 'active'
	from booking
	where  exists (select * from availability where days like '%0%')
;

select 'myname','kaimaa@gmail.com', '', '', '2021-08-28 13:30:00', '2021-08-28 15:30:00', 120, 186, 500, 'fjjewofjpreker;jhsdjfioj849I4TGKISJO', 'active'
where exists (select * from availability where days like '%0%');

select * from availability where days like '%0%';

-- not exists (select 1 from lesson where lesson_id = 1 limit 1)
insert into booking (customer_name, customer_email, customer_phone, 
      note, appointment_start, appointment_end, duration, lesson_id, fee, 
      appointment_cancel_code, status) 
values( 'myname','kaimaa@gmail.com', '', '', '2021-08-28 13:30:00', '2021-08-28 15:30:00', 120, 186, 500, 'fjjewofjpreker;jhsdjfioj849I4TGKISJO', 'active');

select * from booking;

insert into booking (customer_name, customer_email, customer_phone, 
      note, appointment_start, appointment_end, duration, lesson_id, fee, 
      appointment_cancel_code, status) 
      select ?,?,?,?,? as appStart,? as appEnd,?,?,?,?,?,?
      from booking
      where exists (select 1
						from availability
						where days like '%theday%' AND ?s >= start_minute AND ?e <= end_minute
            LIMIT 1)
			AND not exists (SELECT 1
						FROM booking
						where datediff(appStart, appointment_start) = 0 AND
							(appStart < appointment_start AND appEnd > appointment_start) OR
							(appStart >= appointment_start AND appStart < appointment_end)
						LIMIT 1)
            AND 
;
    

SELECT * 
FROM booking
where datediff('2021-08-28 13:00:00', appointment_start) = 0 AND
	('2021-08-28 13:00:00' < appointment_start AND '2021-08-28 13:30:00' > appointment_start) OR
    ('2021-08-28 13:00:00' < appointment_end AND '2021-08-28 13:30:00' > appointment_end) OR
    ('2021-08-28 13:00:00' >= appointment_start AND '2021-08-28 13:30:00' <= appointment_end)
LIMIT 1
    ;

-- SELECT * 
-- FROM booking
-- where datediff(?, appointmnet_start) = 0 AND
-- 	(?s < appointment_start AND ?e > appointment_start) OR
--     (?s < appointment_end AND ?e > appointment_end) OR
--     (?s >= appointment_start AND ?e <= appointment_end)
--     ;
    
--                         if( (headDT < appStart && tailDT > appStart) || 
--                     (headDT < appEnd && tailDT > appEnd) || 
--                     (headDT >= appStart && tailDT <= appEnd)){
-- https://stackoverflow.com/questions/913841/mysql-conditional-insert

select now();

SELECT * 
FROM booking
where datediff('2021-08-28 13:00:00', appointment_start) = 0 AND
	('2021-08-28 13:00:00' < appointment_start AND '2021-08-28 13:30:00' > appointment_start) OR
    ('2021-08-28 13:00:00' < appointment_end AND '2021-08-28 13:30:00' > appointment_end) OR
    ('2021-08-28 13:00:00' >= appointment_start AND '2021-08-28 13:30:00' <= appointment_end)
LIMIT 1
    ;
