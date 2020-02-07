DROP TABLE IF EXISTS aircrafts;
CREATE TABLE IF NOT EXISTS aircrafts (
    id              BINARY(16) PRIMARY KEY,         -- gen_uuid() to generate; also b2u()
    reg_no          CHAR(8) NOT NULL,               -- aircraft registration number; might be unnecessary
    capacity        SMALLINT NOT NULL,              -- max number of seats
    model           VARCHAR(16) NOT NULL,           -- model of aircraft for display
    year_mfd        INT NOT NULL                    -- year manufactured
);
