DROP TABLE IF EXISTS flight_schedule;
CREATE TABLE IF NOT EXISTS flight_schedule (
    id              BINARY(16) PRIMARY KEY,
    route_id        BINARY(16) NOT NULL,            -- see table route
    dtime_depart    DATETIME NOT NULL,
    dtime_arrive    DATETIME NOT NULL,
    aircraft_id     BINARY(16) NOT NULL,
    booked          INT NOT NULL DEFAULT 0,
    max_allowed     INT NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (aircraft_id) REFERENCES aircrafts(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
