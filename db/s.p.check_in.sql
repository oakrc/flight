DROP PROCEDURE IF EXISTS check_in;
CREATE PROCEDURE check_in (IN user_uid CHAR(36), IN ticket_id CHAR(36))
this_proc:BEGIN
    DECLARE tk_stat TINYINT;
    DECLARE cost DECIMAL(8,2);
    DECLARE af_id BINARY(60);
    SELECT tk_stat = tic_status, af_id = fare_id
                    FROM tickets
                    WHERE user_id=UUID_TO_BIN(user_uid)
                        AND id=UUID_TO_BIN(ticket_id);
    IF tk_stat != 1 THEN
        LEAVE this_proc;
    END IF;
    SET cost = (SELECT fare FROM airfares HAVING id=af_id);
    UPDATE tickets
        SET tic_status = 0
        WHERE id=UUID_TO_BIN(ticket_id);
    SET @mi_factor = (SELECT CASE
                                WHEN tier='B' THEN 5
                                WHEN tier='S' THEN 7
                                WHEN tier='G' THEN 9
                                ELSE 0
                            END FROM users HAVING id=UUID_TO_BIN(user_uid));
    UPDATE users
        SET miles = miles + @mi_factor * cost
        WHERE id = UUID_TO_BIN(user_uid); -- TODO: move up tier when jason finishes the document
END//
