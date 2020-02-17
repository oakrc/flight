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
        INSERT INTO airfares VALUES (gen_uuid(), @fl_id, 'F', ROUND((RAND()*(600))+@duration*30+500)),
                                    (gen_uuid(), @fl_id, 'B', ROUND((RAND()*(300))+@duration*25+300)),
                                    (gen_uuid(), @fl_id, 'E', ROUND((RAND()*(200))+@duration*15+30));
        SET @reps = @reps - 1;
    UNTIL @reps = 0 END REPEAT;
END//
