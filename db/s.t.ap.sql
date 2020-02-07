DROP TABLE IF EXISTS airports;
CREATE TABLE IF NOT EXISTS airports (
    iata_code       CHAR(3) PRIMARY KEY,
    name            VARCHAR(60) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    municipality    VARCHAR(64) NOT NULL,
    state           CHAR(2) NOT NULL
);
