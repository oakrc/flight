DROP EVENT IF EXISTS update_miles;
CREATE EVENT update_miles
    ON SCHEDULE EVERY 1 YEAR
    STARTS '2020-01-31 00:00:00'
    ENDS '2099-01-31 00:00:00'
DO BEGIN
    UPDATE users
        SET miles = CASE
            WHEN tier == 'B' THEN miles - 15000
            WHEN tier == 'S' THEN miles - 30000
            WHEN tier == 'G' THEN miles - 45000
            ELSE 0
        END
    UPDATE users
        SET tier = 'B'
        WHERE tier <> '_';
END//
