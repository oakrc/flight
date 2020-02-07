DROP FUNCTION IF EXISTS b2u;
CREATE FUNCTION b2u (bin_uuid BINARY(16))
RETURNS CHAR(36) DETERMINISTIC
RETURN LOWER(CONCAT(
    SUBSTR(HEX(bin_uuid), 1, 8), '-',
    SUBSTR(HEX(bin_uuid), 9, 4), '-',
    SUBSTR(HEX(bin_uuid), 13, 4), '-',
    SUBSTR(HEX(bin_uuid), 17, 4), '-',
    SUBSTR(HEX(bin_uuid), 21)
));
