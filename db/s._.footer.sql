DELIMITER ;
SET FOREIGN_KEY_CHECKS=1;
CALL add_dummy();
CALL add_routes();
INSERT INTO users VALUES (
    gen_uuid(),
    'West',
    'Flight',
    '1995-01-01',
    'O',
    '555-000-8888',
    'noreply@westflightairlines.com',
    '$2b$15$N1JgCucoID6kf70XCbLVnOnoDuy2bck0ZP2zSwQ09L5H/EODFAuO6',
    'G',-- bronze
    10000000,
    1
);
COMMIT;
SET autocommit = 1;
