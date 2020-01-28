DROP TABLE IF EXISTS routes;
CREATE TABLE IF NOT EXISTS routes (
    id              BINARY(16) PRIMARY KEY,
    src             CHAR(3) NOT NULL,
    dest            CHAR(3) NOT NULL,
    dist            DECIMAL(14,7),          -- in miles
    code            INT NOT NULL UNIQUE AUTO_INCREMENT
) AUTO_INCREMENT=1000;
