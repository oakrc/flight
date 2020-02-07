DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id              BINARY(16) PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    birthday        DATE NOT NULL,
    gender          CHAR(1) NOT NULL,
    phone_number    VARCHAR(16) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    pw              CHAR(60) NOT NULL,
    tier            CHAR(1) NOT NULL, -- B = bronze, S = silver, G = gold
    miles           INT NOT NULL,
    verified        BOOL NOT NULL
);
