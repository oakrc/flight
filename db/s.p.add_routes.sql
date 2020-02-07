DROP PROCEDURE IF EXISTS add_routes;
CREATE PROCEDURE add_routes ()
BEGIN
    INSERT INTO routes
    SELECT
        gen_uuid(),
        src_ap.iata_code,
        dest_ap.iata_code,
        69.0 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(src_ap.latitude))
                    * COS(RADIANS(dest_ap.latitude))
                    * COS(RADIANS(src_ap.longitude - dest_ap.longitude))
                    + SIN(RADIANS(src_ap.latitude))
                    * SIN(RADIANS(dest_ap.latitude))))),
        NULL
    FROM airports AS src_ap
    CROSS JOIN airports AS dest_ap
    ON src_ap.iata_code != dest_ap.iata_code;
END//
