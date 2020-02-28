SET autocommit = 0;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS aircrafts;
CREATE TABLE IF NOT EXISTS aircrafts (
    id              BINARY(16) PRIMARY KEY,         -- gen_uuid() to generate; also b2u()
    reg_no          CHAR(8) NOT NULL,               -- aircraft registration number; might be unnecessary
    capacity        SMALLINT NOT NULL,              -- max number of seats
    model           VARCHAR(16) NOT NULL,           -- model of aircraft for display
    year_mfd        INT NOT NULL                    -- year manufactured
);
DROP TABLE IF EXISTS routes;
CREATE TABLE IF NOT EXISTS routes (
    id              BINARY(16) PRIMARY KEY,
    src             CHAR(3) NOT NULL,
    dest            CHAR(3) NOT NULL,
    dist            DECIMAL(14,7),          -- in miles
    code            INT NOT NULL UNIQUE AUTO_INCREMENT
) AUTO_INCREMENT=1000;
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
DROP TABLE IF EXISTS airfares;
CREATE TABLE IF NOT EXISTS airfares (
    id              BINARY(16) PRIMARY KEY,
    flight_id       BINARY(16) NOT NULL,
    cabin           CHAR(1) NOT NULL,               -- aka class
    fare            DECIMAL(8,2) NOT NULL,
    UNIQUE KEY(flight_id,cabin),
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id              BINARY(16) PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    birthday        DATE NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    pw              CHAR(60) NOT NULL,
    tier            CHAR(1) NOT NULL, -- B = bronze, S = silver, G = gold
    miles           INT NOT NULL,
    verified        BOOL NOT NULL
);
DROP TABLE IF EXISTS verification_tokens;
CREATE TABLE IF NOT EXISTS verification_tokens (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    user_id         BINARY(16) NOT NULL,
    token           CHAR(64) NOT NULL,
    dt_created      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
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
    email           VARCHAR(50),
    birthday        DATE NOT NULL,
    addr1           VARCHAR(255) NOT NULL,
    addr2           VARCHAR(255),
    city            VARCHAR(60) NOT NULL,
    state           CHAR(2) NOT NULL,
    postal          CHAR(5) NOT NULL,
    conf            CHAR(6) NOT NULL
    UNIQUE KEY (first_name, last_name, birthday, postal, flight_id),
    FOREIGN KEY (flight_id) REFERENCES flight_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (fare_id) REFERENCES airfares(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS airports;
CREATE TABLE IF NOT EXISTS airports (
    iata_code       CHAR(3) PRIMARY KEY,
    name            VARCHAR(60) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    municipality    VARCHAR(64) NOT NULL,
    state           CHAR(2) NOT NULL
);
INSERT INTO airports (iata_code,name,latitude,longitude,municipality,state) VALUES
 ('PHX','Phoenix Sky Harbor International Airport',33.434299,-112.012001,'Phoenix','AZ')
,('TUS','Tucson International Airport',32.116100,-110.941002,'Tucson','AZ')
,('LAX','Los Angeles International Airport',33.942501,-118.407997,'Los Angeles','CA')
,('OAK','Metropolitan Oakland International Airport',37.721298,-122.221001,'Oakland','CA')
,('ONT','Ontario International Airport',34.056000,-117.600998,'Ontario','CA')
,('SAN','San Diego International Airport',32.733601,-117.190002,'San Diego','CA')
,('SFO','San Francisco International Airport',37.618999,-122.375000,'San Francisco','CA')
,('SJC','Norman Y. Mineta San Jose International Airport',37.362598,-121.929001,'San Jose','CA')
,('SMF','Sacramento International Airport',38.695400,-121.591003,'Sacramento','CA')
,('SNA','John Wayne Airport-Orange County Airport',33.675701,-117.867996,'Santa Ana','CA')
,('HNL','Daniel K Inouye International Airport',21.320620,-157.924228,'Honolulu','HI')
,('BOI','Boise Air Terminal/Gowen Field',43.564400,-116.223000,'Boise','ID')
,('LAS','McCarran International Airport',36.080101,-115.152000,'Las Vegas','NV')
,('RNO','Reno Tahoe International Airport',39.499100,-119.767998,'Reno','NV')
,('PDX','Portland International Airport',45.588699,-122.598000,'Portland','OR')
,('SLC','Salt Lake City International Airport',40.788399,-111.977997,'Salt Lake City','UT')
,('BFI','Boeing Field King County International Airport',47.529999,-122.302002,'Seattle','WA')
,('GEG','Spokane International Airport',47.619900,-117.533997,'Spokane','WA')
,('SEA','Seattle Tacoma International Airport',47.449001,-122.308998,'Seattle','WA');
DROP EVENT IF EXISTS expire_token;
CREATE EVENT expire_token
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
    DELETE FROM verification_tokens WHERE
    dt_created < DATE_SUB(NOW(), INTERVAL 1 DAY);
DELIMITER //
DROP FUNCTION IF EXISTS gen_uuid;
CREATE FUNCTION gen_uuid ()
RETURNS BINARY(16) DETERMINISTIC
RETURN UNHEX(REPLACE(UUID() COLLATE utf8_unicode_ci, "-" COLLATE utf8_unicode_ci, "" COLLATE utf8_unicode_ci));
DROP FUNCTION IF EXISTS b2u;
CREATE FUNCTION b2u (bin_uuid BINARY(16))
RETURNS CHAR(36) DETERMINISTIC
RETURN LOWER(CONCAT(
    SUBSTR(HEX(bin_uuid), 1, 8), '-',
    SUBSTR(HEX(bin_uuid), 9, 4), '-',
    SUBSTR(HEX(bin_uuid), 13, 4), '-',
    SUBSTR(HEX(bin_uuid), 17, 4), '-',
    SUBSTR(HEX(bin_uuid), 21)
));
DROP FUNCTION IF EXISTS u2b;
CREATE FUNCTION u2b (uuid CHAR(36))
RETURNS BINARY(16) DETERMINISTIC
RETURN UNHEX(REPLACE(uuid COLLATE utf8_unicode_ci, "-" COLLATE utf8_unicode_ci, "" COLLATE utf8_unicode_ci));
DROP PROCEDURE IF EXISTS register_user;
CREATE PROCEDURE register_user(
    IN first_name VARCHAR(255),
    IN last_name VARCHAR(255),
    IN birthday DATE,
    IN gender CHAR(1),
    IN phone_number VARCHAR(16),
    IN email VARCHAR(50),
    IN pw BINARY(60)
)
BEGIN
    SET @uuid = gen_uuid();
    INSERT INTO users VALUES (
        @uuid,
        first_name,
        last_name,
        birthday,
        gender,
        phone_number,
        email,
        pw,
        '_',-- bronze
        0,
        0
    );
    INSERT INTO verification_tokens (user_id, token)
    VALUES (
        @uuid,
        LEFT(TO_BASE64(RANDOM_BYTES(64)),64)
    );
END//
DROP PROCEDURE IF EXISTS add_aircraft;
CREATE PROCEDURE add_aircraft (IN model VARCHAR(16), IN cap INT)
BEGIN
    INSERT INTO aircrafts VALUES (
        gen_uuid(),
        LEFT(MD5(RANDOM_BYTES(16)), 8),
        cap,
        model,
        FLOOR(RAND()*3+2016)
    );
END//
DROP PROCEDURE IF EXISTS add_flight;
CREATE PROCEDURE add_flight ()
BEGIN
    SET @item_id = gen_uuid();
    SET @date_from = NOW();
    SET @date_to = DATE_ADD(NOW(), INTERVAL 120 DAY);
    SET @sec = TIMESTAMPDIFF(SECOND, @date_from, @date_to);
    SET @random = ROUND(((@sec-1) * RAND()), 0);
    SET @depart = DATE_ADD(@date_from, INTERVAL @random SECOND);
    SET @arrive = DATE_ADD(@depart, INTERVAL ROUND((RAND()*(5))+1) HOUR);
    SET @ac_id = (SELECT id FROM aircrafts ORDER BY RAND() LIMIT 1);
    SET @max_allowed = (SELECT capacity FROM aircrafts WHERE id=@ac_id);
    INSERT INTO flight_schedule VALUES (
        @item_id,
        (SELECT id FROM routes ORDER BY RAND() LIMIT 1),
        @depart,
        @arrive,
        @ac_id,
        0,
        @max_allowed
    );
    INSERT INTO airfares VALUES (gen_uuid(), @item_id, 'F', ROUND((RAND()*(400))+800)),
    (gen_uuid(), @item_id, 'B', ROUND((RAND()*(200))+350)),
    (gen_uuid(), @item_id, 'E', ROUND((RAND()*(200))+50));
END//
DROP PROCEDURE IF EXISTS buy_ticket;
CREATE PROCEDURE buy_ticket (
    IN user_id CHAR(36),
    IN fl_id CHAR(36),
    IN af_id CHAR(36),
    IN fname VARCHAR(255),
    IN lname VARCHAR(255),
    IN gender CHAR(1),
    IN phone VARCHAR(16),
    IN email VARCHAR(50),
    IN dob DATE,
    IN addr1 VARCHAR(255),
    IN addr2 VARCHAR(255),
    IN city VARCHAR(60),
    IN state CHAR(2),
    IN postal CHAR(5)
)
BEGIN
    INSERT INTO tickets VALUES (
        gen_uuid(),
        u2b(user_id),
        1,
        NOW(),
        u2b(fl_id),
        u2b(af_id),
        fname,
        lname,
        gender,
        phone,
        email,
        dob,
        addr1,
        addr2,
        city,
        state,
        postal,
        LEFT(MD5(RANDOM_BYTES(15)),6)
    );
END//
DROP PROCEDURE IF EXISTS check_in;
CREATE PROCEDURE check_in (
    IN _conf CHAR(6),
    IN _first_name VARCHAR(255),
    IN _last_name VARCHAR(255)
)
this_proc:BEGIN
    DECLARE tk_stat TINYINT;
    DECLARE cost DECIMAL(8,2);
    DECLARE af_id BINARY(60);
    DECLARE tier CHAR(1);
    DECLARE uid BINARY(60) DEFAULT NULL;
    DECLARE ticket_id BINARY(60);
    SELECT user_id INTO uid, id INTO ticket_id FROM tickets WHERE first_name = _first_name AND last_name = _last_name AND conf = _conf;
    IF uid = NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ticket not found';
    END IF;
    SELECT tk_stat = tic_status, af_id = fare_id
                    FROM tickets
                    WHERE user_id=uid
                        AND id=ticket_id;
    IF tk_stat != 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ticket not available for check-in';
    END IF;
    SET cost = (SELECT fare FROM airfares HAVING id=af_id);
    UPDATE tickets
        SET tic_status = 0
        WHERE id=ticket_id;
    SET @mi_factor = (SELECT CASE
                                WHEN tier='_' THEN 1
                                WHEN tier='B' THEN 5
                                WHEN tier='S' THEN 7
                                WHEN tier='G' THEN 9
                                ELSE 0
                            END FROM users HAVING id=uid);
    UPDATE users
        SET miles = miles + @mi_factor * cost
        WHERE id = uid;
    SET @miles = (SELECT miles FROM users WHERE id=uid);
    SELECT users.tier INTO tier FROM users HAVING id=uid;
    IF tier = '_' AND @miles >= 15000 AND @miles < 30000 THEN
        UPDATE users
            SET tier = 'B'
            WHERE id=uid;
    ELSEIF tier = 'B' AND @miles >= 30000 AND @miles < 45000 THEN
        UPDATE users
            SET tier = 'S'
            WHERE id=uid;
    ELSEIF tier = 'S' AND @miles >= 45000 THEN
        UPDATE users
            SET tier = 'G'
            WHERE id=uid;
    END IF;
END//
DROP PROCEDURE IF EXISTS add_dummy_aircrafts;
CREATE PROCEDURE add_dummy_aircrafts ()
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
END//
DROP PROCEDURE IF EXISTS add_dummy_flights;
CREATE PROCEDURE add_dummy_flights (IN src CHAR(3), IN dest CHAR(3), IN dtime_depart DATETIME)
BEGIN
    DECLARE dist DECIMAL(14,7);
    DECLARE rt_id BINARY(16);
    SELECT routes.id, routes.dist
        INTO rt_id, dist
        FROM routes
        WHERE routes.src=src AND routes.dest=dest;
    SET @duration = dist / 555.0; -- plane: 555 mph
    SET @reps = 15;
    REPEAT
        SET @fl_id = gen_uuid();
        SET @depart = DATE_ADD(dtime_depart, INTERVAL ROUND(RAND()*600) MINUTE);
        SET @arrive = DATE_ADD(@depart, INTERVAL ROUND(RAND()*0.06*@duration*60)+ROUND(@duration*60) MINUTE);
        SET @ac_id = (SELECT id FROM aircrafts ORDER BY RAND() LIMIT 1);
        SET @max_allowed = (SELECT capacity FROM aircrafts WHERE id=@ac_id);
        INSERT INTO flight_schedule VALUES (
            @fl_id,
            rt_id,
            @depart,
            @arrive,
            @ac_id,
            0,
            @max_allowed
        );
        INSERT INTO airfares VALUES (gen_uuid(), @fl_id, 'F', ROUND((RAND()*(100))+@duration*75+170)),
                                    (gen_uuid(), @fl_id, 'B', ROUND((RAND()*(50))+@duration*55+140)),
                                    (gen_uuid(), @fl_id, 'E', ROUND((RAND()*(20))+@duration*20+25));
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;
END//
DROP PROCEDURE IF EXISTS add_routes;
CREATE PROCEDURE add_routes ()
BEGIN
    INSERT INTO routes
    SELECT
        gen_uuid(),
        src_ap.iata_code,
        dest_ap.iata_code,
        69.0 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(src_ap.latitude))
                    * COS(RADIANS(dest_ap.latitude))
                    * COS(RADIANS(src_ap.longitude - dest_ap.longitude))
                    + SIN(RADIANS(src_ap.latitude))
                    * SIN(RADIANS(dest_ap.latitude))))),
        NULL
    FROM airports AS src_ap
    CROSS JOIN airports AS dest_ap
    ON src_ap.iata_code != dest_ap.iata_code;
END//
DELIMITER ;
SET FOREIGN_KEY_CHECKS=1;
CALL add_dummy();
CALL add_routes();
INSERT INTO users VALUES (
    gen_uuid(),
    'West',
    'Flight',
    '1995-01-01',
    'O',
    '555-000-8888',
    'noreply@westflightairlines.com',
    '$2b$15$N1JgCucoID6kf70XCbLVnOnoDuy2bck0ZP2zSwQ09L5H/EODFAuO6',
    'G',-- bronze
    10000000,
    1
);
COMMIT;
SET autocommit = 1;
