/*
 * By Zhenkai Weng
 * FBLA Web Design 2019-2020: WestFlight Airlines
 *
 * Database schema in SQL format
 * Also inserts sample user & flight data for demo
 */

/*
 * To test...
 * drop database westflight; create database westflight; use westflight; set autocommit=0; source db/schema.sql; commit; CALL register_user('Example','User','2000-01-01','M','5550687272','a@gmail.com','$2y$12$8Zi9WTNlwm2dZ4NRueQCWOw5ouQzXjJiHXG4oHcOzyxj5juFpJAca'); CALL add_dummy_flights('LAX','BOI','2020-04-20 08:00:00'); commit; set autocommit=1;
 * drop database westflight; create database westflight; use westflight; set autocommit=0; source db/schema.sql; commit; CALL add_dummy_flights('LAX','BOI','2020-04-20 08:00:00'); commit; set autocommit=1;
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
    duration        DECIMAL(10,7),
    dist            DECIMAL(10,7),
    code            CHAR(7) NOT NULL UNIQUE
);

CREATE TABLE flight_schedule (
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

CREATE TABLE airfares (
    id              BINARY(16) PRIMARY KEY,
    flight_id       BINARY(16) NOT NULL,
    cabin           CHAR(1) NOT NULL,               -- aka class
    fare            DECIMAL(8,2) NOT NULL,
    UNIQUE KEY(flight_id,cabin),
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE users (
    id              BINARY(16) PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    birthday        DATE NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    pw              CHAR(60) NOT NULL,
    tier            CHAR(1) NOT NULL, -- B = bronze, S = silver, G = gold
    miles           INT NOT NULL
);

/*CREATE TABLE passengers (
    id              BINARY(16) PRIMARY KEY,
    user_id         BINARY(16) NOT NULL,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16) DEFAULT NULL,
    birthday        DATE NOT NULL,
    addr1           VARCHAR(255) NOT NULL,
    addr2           VARCHAR(255) DEFAULT NULL,
    city            VARCHAR(60) NOT NULL,
    state           CHAR(2) NOT NULL,
    postal          CHAR(5) NOT NULL,
    UNIQUE KEY (first_name, last_name, birth_year)
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);*/

CREATE TABLE tickets (
    id              BINARY(16) PRIMARY KEY,
    user_id         BINARY(16) NOT NULL,
 -- passenger_id    BINARY(16) NOT NULL,
    tic_status      TINYINT NOT NULL DEFAULT 1,
    dtime_booked    DATETIME NOT NULL DEFAULT NOW(),
    flight_id       BINARY(16) NOT NULL,
    fare_id         BINARY(16) NOT NULL,
    -- passenger info
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
 -- UNIQUE KEY(flight_id, passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (fare_id) REFERENCES airfares(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

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
IGNORE 1 LINES;

/* functions for managing db and adding dummy data */

DELIMITER //

CREATE PROCEDURE add_aircraft (IN model VARCHAR(16), IN cap INT)
BEGIN
    INSERT INTO aircrafts VALUES (
        UUID_TO_BIN(UUID()),
        LEFT(MD5(RANDOM_BYTES(16)), 8),
        cap,
        model,
        FLOOR(RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(2020-2017)*2017)
    );
END//

CREATE PROCEDURE add_flight ()
BEGIN
    SET @item_id = UUID_TO_BIN(UUID());
    SET @date_from = NOW();
    SET @date_to = DATE_ADD(NOW(), INTERVAL 120 DAY);
    SET @sec = TIMESTAMPDIFF(SECOND, @date_from, @date_to);
    SET @random = ROUND(((@sec-1) * RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 0);
    SET @depart = DATE_ADD(@date_from, INTERVAL @random SECOND);
    SET @arrive = DATE_ADD(@depart, INTERVAL ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(5))+1) HOUR);
    SET @ac_id = (SELECT id FROM aircrafts ORDER BY RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) LIMIT 1);
    SET @max_allowed = (SELECT capacity FROM aircrafts WHERE id=@ac_id);
    INSERT INTO flight_schedule VALUES (
        @item_id,
        (SELECT id FROM routes ORDER BY RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) LIMIT 1),
        @depart,
        @arrive,
        @ac_id,
        0,
        @max_allowed
    );
    INSERT INTO airfares VALUES (UUID_TO_BIN(UUID()), @item_id, 'F', ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(400))+800)),
    (UUID_TO_BIN(UUID()), @item_id, 'B', ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(200))+350)),
    (UUID_TO_BIN(UUID()), @item_id, 'E', ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(200))+50));
END//

CREATE PROCEDURE register_user(
    IN first_name VARCHAR(255),
    -- IN middle_name VARCHAR(255),
    IN last_name VARCHAR(255),
    IN birthday DATE,
    IN gender CHAR(1),
    IN phone_number VARCHAR(16),
    IN email VARCHAR(50),
    IN pw BINARY(60)
)
BEGIN
    INSERT INTO users VALUES (
        UUID_TO_BIN(UUID()),
        first_name,
        -- middle_name,
        last_name,
        birthday,
        gender,
        phone_number,
        email,
        pw,
        'B',-- bronze
        0
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

CREATE PROCEDURE add_dummy_flights (IN src CHAR(3), IN dest CHAR(3), IN dtime_depart DATETIME)
BEGIN
    DECLARE dist DECIMAL(10,7);

    SET dist = (SELECT 69.0 * DEGREES(ACOS(lEAST(1.0, COS(RADIANS(a.latitude))
                    * COS(RADIANS(b.latitude))
                    * COS(RADIANS(a.longitude - b.longitude))
                    + SIN(RADIANS(a.latitude))
                    * SIN(RADIANS(b.latitude)))))
        FROM airports AS a
        JOIN airports AS b ON a.iata_code = src AND b.iata_code = dest);

    SET @duration = dist / 555.0; -- plane: 555 mph
    SET @rt_id = UUID_TO_BIN(UUID());

    INSERT INTO routes VALUES (
        @rt_id,
        src,
        dest,
        @duration + RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*1.07 - 0.5,
        dist,
        CONCAT('WF', FLOOR(RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(8999)+10000))
    );

    SET @reps = 15;
    REPEAT
        SET @item_id = UUID_TO_BIN(UUID());
        SET @depart = dtime_depart + INTERVAL (RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*15.7*60+7*60) MINUTE;
        SET @arrive = @depart + INTERVAL ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(65))) MINUTE + INTERVAL @duration HOUR;
        SET @ac_id = (SELECT id FROM aircrafts ORDER BY RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) LIMIT 1);
        SET @max_allowed = (SELECT capacity FROM aircrafts WHERE id=@ac_id);
        INSERT INTO flight_schedule VALUES (
            @item_id,
            @rt_id,
            @depart,
            @arrive,
            @ac_id,
            0,
            @max_allowed
        );
        INSERT INTO airfares VALUES (UUID_TO_BIN(UUID()), @item_id, 'F', ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(400))+800)),
                                    (UUID_TO_BIN(UUID()), @item_id, 'B', ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(200))+350)),
                                    (UUID_TO_BIN(UUID()), @item_id, 'E', ROUND((RAND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)*(100))+50)-0.01);
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;
END//

CREATE PROCEDURE buy_ticket (
    IN user_id CHAR(36),
    IN fl_id CHAR(36),
    IN af_id CHAR(36),
    IN fname VARCHAR(255),
    IN lname VARCHAR(255),
    IN gender CHAR(1),
    IN phone VARCHAR(16),
    IN dob DATE,
    IN addr1 VARCHAR(255),
    IN addr2 VARCHAR(255),
    IN city VARCHAR(60),
    IN state CHAR(2),
    IN postal CHAR(5)
)
BEGIN
    INSERT INTO tickets VALUES (
        UUID_TO_BIN(UUID()),
        UUID_TO_BIN(user_id),
        1,
        NOW(),
        UUID_TO_BIN(fl_id),
        UUID_TO_BIN(af_id),
        fname,
        lname,
        gender,
        phone,
        dob,
        addr1,
        addr2,
        city,
        state,
        postal
    );
END//

CREATE PROCEDURE add_job_app (
        IN jid INT,
        IN fname VARCHAR(255),
        IN lname VARCHAR(255),
        IN birth_year YEAR(4),
        IN phone VARCHAR(16),
        IN email VARCHAR(255)
    )
BEGIN
    INSERT INTO jobs VALUES (
        UUID_TO_BIN(UUID()),
        0,
        fname,
        lname,
        birth_year,
        phone,
        email,
        jid,
        NULL
    );
END//

CREATE PROCEDURE check_in (IN user_uid CHAR(36), IN ticket_id CHAR(36))
this_proc:BEGIN
    DECLARE tk_stat TINYINT;
    DECLARE cost DECIMAL(8,2);
    DECLARE af_id BINARY(60);
    SELECT tk_stat = tic_status, af_id = fare_id
                    FROM tickets
                    WHERE user_id=UUID_TO_BIN(user_uid)
                        AND id=UUID_TO_BIN(ticket_id);
    IF tk_stat != 1 THEN
        LEAVE this_proc;
    END IF;
    SET cost = (SELECT fare FROM airfares HAVING id=af_id);
    UPDATE tickets
        SET tic_status = 0
        WHERE id=UUID_TO_BIN(ticket_id);
    SET @mi_factor = (SELECT CASE
                                WHEN tier='B' THEN 5
                                WHEN tier='S' THEN 7
                                WHEN tier='G' THEN 9
                                ELSE 0
                            END FROM users HAVING id=UUID_TO_BIN(user_uid));
    UPDATE users
        SET miles = miles + @mi_factor * cost
        WHERE id = UUID_TO_BIN(user_uid);
    -- TODO: move up tier when jason finishes the document
END//

DELIMITER ;

CALL add_dummy();
