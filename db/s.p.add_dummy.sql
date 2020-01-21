DROP PROCEDURE IF EXISTS add_dummy;
CREATE PROCEDURE add_dummy ()
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
/*
    INSERT INTO jobs (title,dept,location) VALUES
    ('Sr. Software Engineer','IT','Walnut, CA'),
    ('Aircraft Support Mechanic','Cabin - Dept #5','Walnut, CA'),
    ('Aircraft Maintenance Technician','Line - Dept #32','Walnut, CA'),
    ('Sr. Repair Coordinator','Repair - Dept #2','Los Angeles, CA'),
    ('Director','Global Corporate Sales','Los Angeles, CA'),
    ('Principal Engineer','Engineering','Walnut, CA'),
    ('Team Leader','Global Assistance','Los Angeles, CA'),
    ('Pre-flight Inspector','Dept #9','Los Angeles, CA'),
    ('Sr. Analyst','Inventory','Walnut, CA'),
    ('Customer Service Agent','Customer Service','Los Angeles, CA')
    ;
*/
END//
