-- select * from information_schema.tables;
-- select * from pg_database;
--
-- DROP DATABASE "inventory-control";
-- CREATE DATABASE "inventory-control";

DROP TABLE stocktakes;
DROP TABLE submissions;
DROP TABLE fixtures;
DROP TABLE employees;

CREATE TABLE fixtures (
    id VARCHAR NOT NULL,
    description text NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employees (
    id VARCHAR NOT NULL,
    name VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE submissions(
    id SERIAL NOT NULL,
    fixture_id VARCHAR REFERENCES fixtures(id) NOT NULL,
    employee_id VARCHAR REFERENCES employees(id) NOT NULL,
    dateTime timestamp NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE stocktakes (
    id INTEGER NOT NULL,
    submission_id INTEGER REFERENCES submissions(id) NOT NULL,
    csku VARCHAR NULL,
    rskuid VARCHAR NULL,
    upc VARCHAR NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY (id, submission_id)
);
