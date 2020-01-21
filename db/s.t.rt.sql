DROP TABLE IF EXISTS routes;
CREATE TABLE IF NOT EXISTS routes (
    id              BINARY(16) PRIMARY KEY,
    src             CHAR(3) NOT NULL,
    dest            CHAR(3) NOT NULL,
    duration        DECIMAL(10,7),
    dist            DECIMAL(14,7),
    code            CHAR(7) NOT NULL UNIQUE
);
