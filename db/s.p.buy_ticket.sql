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
