DROP PROCEDURE IF EXISTS add_aircraft;
CREATE PROCEDURE add_aircraft (IN model VARCHAR(16), IN cap INT)
BEGIN
    INSERT INTO aircrafts VALUES (
        gen_uuid(),
        LEFT(MD5(RANDOM_BYTES(16)), 8),
        cap,
        model,
        FLOOR(RAND()*(2020-2017)*2017)
    );
END//
