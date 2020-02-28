DROP PROCEDURE IF EXISTS check_in;
CREATE PROCEDURE check_in (
    IN _conf CHAR(6),
    IN _first_name VARCHAR(255),
    IN _last_name VARCHAR(255)
)
this_proc:BEGIN
    DECLARE tk_stat TINYINT;
    DECLARE cost DECIMAL(8,2);
    DECLARE af_id BINARY(60);
    DECLARE tier CHAR(1);
    DECLARE uid BINARY(60) DEFAULT NULL;
    DECLARE ticket_id BINARY(60);
    SELECT user_id INTO uid, id INTO ticket_id FROM tickets WHERE first_name = _first_name AND last_name = _last_name AND conf = _conf;
    IF uid = NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ticket not found';
    END IF;
    SELECT tk_stat = tic_status, af_id = fare_id
                    FROM tickets
                    WHERE user_id=uid
                        AND id=ticket_id;
    IF tk_stat != 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ticket not available for check-in';
    END IF;
    SET cost = (SELECT fare FROM airfares HAVING id=af_id);
    UPDATE tickets
        SET tic_status = 0
        WHERE id=ticket_id;
    SET @mi_factor = (SELECT CASE
                                WHEN tier='_' THEN 1
                                WHEN tier='B' THEN 5
                                WHEN tier='S' THEN 7
                                WHEN tier='G' THEN 9
                                ELSE 0
                            END FROM users HAVING id=uid);
    UPDATE users
        SET miles = miles + @mi_factor * cost
        WHERE id = uid;
    SET @miles = (SELECT miles FROM users WHERE id=uid);
    SELECT users.tier INTO tier FROM users HAVING id=uid;
    IF tier = '_' AND @miles >= 15000 AND @miles < 30000 THEN
        UPDATE users
            SET tier = 'B'
            WHERE id=uid;
    ELSEIF tier = 'B' AND @miles >= 30000 AND @miles < 45000 THEN
        UPDATE users
            SET tier = 'S'
            WHERE id=uid;
    ELSEIF tier = 'S' AND @miles >= 45000 THEN
        UPDATE users
            SET tier = 'G'
            WHERE id=uid;
    END IF;
END//
