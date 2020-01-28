DROP PROCEDURE IF EXISTS add_dummy_flights;
CREATE PROCEDURE add_dummy_flights (IN src CHAR(3), IN dest CHAR(3), IN dtime_depart DATETIME)
BEGIN
    DECLARE dist DECIMAL(14,7);
    SET dist = (SELECT 69.0 * DEGREES(ACOS(lEAST(1.0, COS(RADIANS(a.latitude))
                    * COS(RADIANS(b.latitude))
                    * COS(RADIANS(a.longitude - b.longitude))
                    + SIN(RADIANS(a.latitude))
                    * SIN(RADIANS(b.latitude)))))
        FROM airports AS a
        JOIN airports AS b ON a.iata_code = src AND b.iata_code = dest);

    SET @duration = dist / 555.0; -- plane: 555 mph
    SET @reps = 15;
    REPEAT
        SET @rt_id = gen_uuid();

        INSERT INTO routes VALUES (
            @rt_id,
            src,
            dest,
            @duration + RAND()*1.07 - 0.5,
            dist,
            CONCAT('WF', FLOOR(RAND()*(8999)+10000))
        );
        SET @item_id = gen_uuid();
        SET @depart = dtime_depart;
        SET @arrive = @depart + INTERVAL ROUND((RAND()*(65))) MINUTE + INTERVAL @duration HOUR;
        SET @ac_id = (SELECT id FROM aircrafts ORDER BY RAND() LIMIT 1);
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
        INSERT INTO airfares VALUES (gen_uuid(), @item_id, 'F', ROUND((RAND()*(400))+800)),
                                    (gen_uuid(), @item_id, 'B', ROUND((RAND()*(200))+350)),
                                    (gen_uuid(), @item_id, 'E', ROUND((RAND()*(100))+50));
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;
END//
