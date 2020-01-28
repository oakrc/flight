DROP PROCEDURE IF EXISTS register_user;
CREATE PROCEDURE register_user(
    IN first_name VARCHAR(255),
    IN last_name VARCHAR(255),
    IN birthday DATE,
    IN gender CHAR(1),
    IN phone_number VARCHAR(16),
    IN email VARCHAR(50),
    IN pw BINARY(60),
    IN token CHAR(64)
)
BEGIN
    INSERT INTO users VALUES (
        gen_uuid(),
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
        user_id,
        token
    );
END//
