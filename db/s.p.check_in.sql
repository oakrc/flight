DROP PROCEDURE IF EXISTS check_in;
CREATE PROCEDURE check_in (IN user_uid CHAR(36), IN ticket_id CHAR(36))
this_proc:BEGIN
    DECLARE tk_stat TINYINT;
    DECLARE cost DECIMAL(8,2);
    DECLARE af_id BINARY(60);
    DECLARE tier CHAR(1);
    SELECT tk_stat = tic_status, af_id = fare_id
                    FROM tickets
                    WHERE user_id=u2b(user_uid)
                        AND id=u2b(ticket_id);
    IF tk_stat != 1 THEN
        LEAVE this_proc;
    END IF;
    SET cost = (SELECT fare FROM airfares HAVING id=af_id);
    UPDATE tickets
        SET tic_status = 0
        WHERE id=u2b(ticket_id);
    SET @mi_factor = (SELECT CASE
                                WHEN tier='_' THEN 1
                                WHEN tier='B' THEN 5
                                WHEN tier='S' THEN 7
                                WHEN tier='G' THEN 9
                                ELSE 0
                            END FROM users HAVING id=u2b(user_uid));
    UPDATE users
        SET miles = miles + @mi_factor * cost;
        WHERE id = u2b(user_uid);
    SET @miles = (SELECT miles FROM users WHERE id=u2b(user_uid));
    SELECT users.tier INTO tier FROM users HAVING id=u2b(user_uid);
    IF tier == '_' AND @miles >= 15000 AND @miles < 30000 THEN
        UPDATE users
            SET tier = 'B'
            WHERE id=u2b(user_uid);
    ELSEIF tier == 'B' AND @miles >= 30000 AND @miles < 45000 THEN
        UPDATE users
            SET tier = 'S'
            WHERE id=u2b(user_uid);
    ELSEIF tier == 'S' AND @miles >= 45000 THEN
        UPDATE users
            SET tier = 'G'
            WHERE id=u2b(user_uid);
    ENDIF;
END//
