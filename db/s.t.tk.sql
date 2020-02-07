DROP TABLE IF EXISTS tickets;
CREATE TABLE IF NOT EXISTS tickets (
    id              BINARY(16) PRIMARY KEY,
    user_id         BINARY(16) NOT NULL,
    tic_status      TINYINT NOT NULL DEFAULT 1,
    dtime_booked    DATETIME NOT NULL DEFAULT NOW(),
    flight_id       BINARY(16) NOT NULL,
    fare_id         BINARY(16) NOT NULL,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16),
    birthday        DATE NOT NULL,
    addr1           VARCHAR(255) NOT NULL,
    addr2           VARCHAR(255),
    city            VARCHAR(60) NOT NULL,
    state           CHAR(2) NOT NULL,
    postal          CHAR(5) NOT NULL,
    UNIQUE KEY (first_name, last_name, birthday, postal, flight_id),
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (fare_id) REFERENCES airfares(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
