DROP TABLE IF EXISTS airfares;
CREATE TABLE IF NOT EXISTS airfares (
    id              BINARY(16) PRIMARY KEY,
    flight_id       BINARY(16) NOT NULL,
    cabin           CHAR(1) NOT NULL,               -- aka class
    fare            DECIMAL(8,2) NOT NULL,
    UNIQUE KEY(flight_id,cabin),
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE
);
