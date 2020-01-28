DELIMITER ;
SET FOREIGN_KEY_CHECKS=1;
CALL add_dummy();
CALL register_user('Example','User','2000-01-01','M','5550687272','a@gmail.com','$2y$12$8Zi9WTNlwm2dZ4NRueQCWOw5ouQzXjJiHXG4oHcOzyxj5juFpJAca');
CALL add_dummy_flights('LAX','BOI','2023-04-20 08:00:00');
COMMIT;
SET autocommit = 1;
