DROP PROCEDURE IF EXISTS check_in;
CREATE PROCEDURE check_in (
    IN _conf CHAR(6),
    IN _first_name VARCHAR(255),
    IN _last_name VARCHAR(255)
)
this_proc:BEGIN
    DECLARE tk_stat TINYINT;
    DECLARE cost DECIMAL(8,2);
    DECLARE af_id BINARY(16);
    DECLARE tier CHAR(1);
    DECLARE usid BINARY(16) DEFAULT NULL;
    DECLARE ticket_id BINARY(16);
    SELECT user_id, id INTO usid, ticket_id FROM tickets WHERE first_name = _first_name AND last_name = _last_name AND conf = _conf;
    IF usid = NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ticket not found';
    END IF;
    SELECT tk_stat = tic_status, af_id = fare_id
                    FROM tickets
                    WHERE user_id=usid
                        AND id=ticket_id;
    IF tk_stat != 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ticket not available for check-in';
    END IF;
    SET cost = (SELECT fare FROM airfares WHERE id=af_id);
    UPDATE tickets
        SET tic_status = 0
        WHERE id=ticket_id;
    SET @mi_factor = (SELECT CASE
                                WHEN tier='_' THEN 1
                                WHEN tier='B' THEN 5
                                WHEN tier='S' THEN 7
                                WHEN tier='G' THEN 9
                                ELSE 0
                            END FROM users WHERE id=usid);
    UPDATE users
        SET miles = miles + @mi_factor * cost + 200
        WHERE id = usid;
    SET @miles = (SELECT miles FROM users WHERE id=usid);
    SELECT users.tier INTO tier FROM users WHERE id=usid;
    IF tier = '_' AND @miles >= 15000 AND @miles < 30000 THEN
        UPDATE users
            SET tier = 'B'
            WHERE id=usid;
    ELSEIF tier = 'B' AND @miles >= 30000 AND @miles < 45000 THEN
        UPDATE users
            SET tier = 'S'
            WHERE id=usid;
    ELSEIF tier = 'S' AND @miles >= 45000 THEN
        UPDATE users
            SET tier = 'G'
            WHERE id=usid;
    END IF;
END//
