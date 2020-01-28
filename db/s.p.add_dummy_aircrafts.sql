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
