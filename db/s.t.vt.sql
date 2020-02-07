DROP TABLE IF EXISTS verification_tokens;
CREATE TABLE IF NOT EXISTS verification_tokens (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    user_id         BINARY(16) NOT NULL,
    token           CHAR(64) NOT NULL,
    dt_created      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
