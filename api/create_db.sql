/*
 * By Zhenkai Weng
 * FBLA Web Design 2019-2020: WestFlight Airlines
 *
 * Database schema in SQL format
 * Also inserts sample user & flight data for demo
 */

/* To test...
 * drop database westflight; create database westflight; use westflight; set autocommit=0; source create_db.sql; commit;
 */

/* 
 * Create tables
 * All __rowid__s are UUIDs
 *
 */

CREATE TABLE aircrafts (
    id              BINARY(16) PRIMARY KEY,         -- UUID_TO_BIN(UUID()) to generate; also BIN_TO_UUID()
    reg_no          CHAR(8) NOT NULL,               -- aircraft registration number; might be unnecessary
    capacity        SMALLINT NOT NULL,              -- max number of seats
    model           VARCHAR(16) NOT NULL,           -- model of aircraft for display
    year_mfd        INT NOT NULL                    -- year manufactured
);
CREATE TABLE routes (
    id              BINARY(16) PRIMARY KEY,
    src             CHAR(3) NOT NULL,
    dest            CHAR(3) NOT NULL,
    `round`         BOOL NOT NULL,
    code            CHAR(8) NOT NULL UNIQUE
);
CREATE TABLE flight_schedule (
    id              BINARY(16) PRIMARY KEY,
    route_id        BINARY(16) NOT NULL,            -- see table route
    dtime_depart    DATETIME NOT NULL,
    dtime_arrive    DATETIME NOT NULL,
    aircraft_id     BINARY(16) NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (aircraft_id) REFERENCES aircrafts(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TABLE airfares (
    id              BINARY(16) PRIMARY KEY,
    flight_id       BINARY(16) NOT NULL,
    cabin           CHAR(1) NOT NULL,               -- aka class
    fare            DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE users (
    id              BINARY(16) PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    middle_name     VARCHAR(255) DEFAULT NULL,
    last_name       VARCHAR(255) NOT NULL,
    birth_year      YEAR(4) NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16) DEFAULT NULL,
    email           VARCHAR(50) NOT NULL,
    pw              BINARY(60) NOT NULL,
);
CREATE TABLE passengers (
    id              BINARY(16) PRIMARY KEY,
    user_id         BINARY(16) NOT NULL,
    first_name      VARCHAR(255) NOT NULL,
    middle_name     VARCHAR(255) DEFAULT NULL,
    last_name       VARCHAR(255) NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16) DEFAULT NULL,
    birth_year      YEAR(4) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE tickets (
    id              BINARY(16) PRIMARY KEY,
    user_id         BINARY(16) NOT NULL,
    tic_status      TINYINT NOT NULL DEFAULT 1,         -- ticket status
    dtime_booked    DATETIME NOT NULL,
    fare_id         BINARY(16) NOT NULL,
    FOREIGN KEY (fare_id) REFERENCES airfares(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
/*CREATE TABLE transactions (
    id              BINARY(16) PRIMARY KEY,
    user_id         BINARY(16) NOT NULL,
    ticket_id       BINARY(16) NOT NULL,
    charge          DECIMAL(8,2) NOT NULL,                   -- positive for income, negative for compensation
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);*/
CREATE TABLE jobs (
    id              INT PRIMARY KEY AUTO_INCREMENT,                    -- UUID unnecessary
    title           VARCHAR(64) NOT NULL,
    dept            VARCHAR(64),
    location        VARCHAR(64) NOT NULL,
    available       BOOL DEFAULT TRUE
);
CREATE TABLE applications (
    id              BINARY(16) PRIMARY KEY,
    app_status      TINYINT NOT NULL DEFAULT 0,
    first_name      VARCHAR(255) NOT NULL,
    middle_name     VARCHAR(255) DEFAULT NULL,
    last_name       VARCHAR(255) NOT NULL,
    birth_year      YEAR(4) NOT NULL,
    phone_number    VARCHAR(16) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    job_id          INT NOT NULL,
    response        TEXT DEFAULT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE airports (
    iata_code       CHAR(3) PRIMARY KEY,
    name            VARCHAR(60) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    municipality    VARCHAR(64) NOT NULL,
    state           CHAR(2) NOT NULL
);

/* Load airport data from csv */
/* IMPORT USING MYSQL DASHBOARD */
LOAD DATA INFILE '/var/lib/mysql-files/airports.csv'
    INTO TABLE airports
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS;

/* functions for managing db and adding dummy data */

DELIMITER //

CREATE PROCEDURE add_aircraft (IN model VARCHAR(16), IN cap INT)
BEGIN
    INSERT INTO aircrafts VALUES (
        UUID_TO_BIN(UUID()),
        LEFT(MD5(RANDOM_BYTES(16)), 8),
        cap,
        model,
        FLOOR(RAND()*(2020-2017)*2017)
    );
END//

CREATE PROCEDURE add_route ()
BEGIN
    INSERT INTO routes VALUES (
        UUID_TO_BIN(UUID()),
        (SELECT iata_code FROM airports ORDER BY RAND() LIMIT 1),
        (SELECT iata_code FROM airports ORDER BY RAND() LIMIT 1),
        ROUND(RAND(),0),
        LEFT(MD5(RANDOM_BYTES(16)), 8)
    );
END//

CREATE PROCEDURE add_flight ()
BEGIN
    SET @item_id = UUID_TO_BIN(UUID());
    SET @date_from = NOW(); 
    SET @date_to = DATE_ADD(NOW(), INTERVAL 120 DAY);
    SET @sec = TIMESTAMPDIFF(SECOND, @date_from, @date_to);
    SET @random = ROUND(((@sec-1) * RAND()), 0);
    SET @depart = DATE_ADD(@date_from, INTERVAL @random SECOND);
    SET @arrive = DATE_ADD(@depart, INTERVAL ROUND((RAND(0.242)*(5))+1) HOUR);
    INSERT INTO flight_schedule VALUES (
        @item_id,
        (SELECT id FROM routes ORDER BY RAND() LIMIT 1),
        @depart,
        @arrive,
        (SELECT id FROM aircrafts ORDER BY RAND() LIMIT 1)
    );
    INSERT INTO airfares VALUES (UUID_TO_BIN(UUID()), @item_id, 'F', ROUND((RAND(0.142)*(400))+800)),
                                (UUID_TO_BIN(UUID()), @item_id, 'B', ROUND((RAND(0.242)*(200))+350)),
                                (UUID_TO_BIN(UUID()), @item_id, 'E', ROUND((RAND(0.342)*(200))+50));
END//

CREATE PROCEDURE register_user(
    IN first_name VARCHAR(255) NOT NULL,
    IN middle_name VARCHAR(255),
    IN last_name VARCHAR(255) NOT NULL,
    IN birth_year YEAR(4) NOT NULL,
    IN gender CHAR(1) NOT NULL,
    IN phone_number VARCHAR(16),
    IN email VARCHAR(50) NOT NULL,
    IN pw BINARY(60) NOT NULL
)
BEGIN
    INSERT INTO user VALUES (
        UUID_TO_BIN(UUID()),
        first_name,
        middle_name,
        last_name,
        birth_year,
        gender,
        phone_number,
        email,
        pw
    );
END//

/* Insert dummy data */
CREATE PROCEDURE add_dummy ()
BEGIN
    SET @reps = 50;
    REPEAT
        CALL add_aircraft('Airbus A320-200',150);
        CALL add_aircraft('Airbus A321-200',190);
        CALL add_aircraft('Airbus A321-200',190);
        CALL add_aircraft('Airbus A321-200',190);
        CALL add_aircraft('Airbus A330-200',247);
        CALL add_aircraft('Boeing 737-800',172);
        CALL add_aircraft('Boeing 737-800',172);
        CALL add_aircraft('Boeing 787-9',285);
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;

    SET @reps = 200;
    REPEAT
        CALL add_route();
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;

    SET @reps = 500;
    REPEAT
        CALL add_flight();
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;

    INSERT INTO jobs (title,dept,location) VALUES
        ('Sr. Software Engineer','IT','Walnut, CA'),
        ('Aircraft Support Mechanic','Cabin - Dept #5','Walnut, CA'),
        ('Aircraft Maintenance Technician','Line - Dept #32','Walnut, CA'),
        ('Sr. Repair Coordinator','Repair - Dept #2','Los Angeles, CA'),
        ('Director','Global Corporate Sales','Los Angeles, CA'),
        ('Principal Engineer','Engineering','Walnut, CA'),
        ('Team Leader','Global Assistance','Los Angeles, CA'),
        ('Pre-flight Inspector','Dept #9','Los Angeles, CA'),
        ('Sr. Analyst','Inventory','Walnut, CA'),
        ('Customer Service Agent','Customer Service','Los Angeles, CA')
    ;
END//
DELIMITER ;

CALL add_dummy();
