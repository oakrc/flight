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
