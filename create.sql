drop schema cccat13 cascade;

create schema cccat13;

create table cccat13.account (
	account_id uuid,
	name text,
	email text,
	cpf text,
	car_plate text,
	is_passenger boolean,
	is_driver boolean,
	date timestamp,
	is_verified boolean,
	verification_code uuid,
	password text,
	password_algorithm text,
	salt text
);

create table cccat13.ride (
	ride_id uuid,
	passenger_id uuid,
	driver_id uuid,
	status text,
	fare numeric,
	distance numeric,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	date timestamp
);

create table cccat13.position (
	position_id uuid primary key,
	ride_id uuid,
	lat numeric,
	long numeric,
	date timestamp
);

create table cccat13.ride_projection (
	ride_id uuid,
	passenger_name text,
	passenger_email text,
	status text
);

create table cccat13.unit_of_work (
	id uuid,
	name text
);
