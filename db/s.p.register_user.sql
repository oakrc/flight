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
        'B',-- bronze
        0,
        0
    );
    INSERT INTO verification_tokens (user_id, token)
    VALUES (
        @uuid,
        LEFT(TO_BASE64(RANDOM_BYTES(64)),64)
    );
END//
