SELECT
    b2u(f_id) AS fl_id,
    b2u(r_id) AS rt_id,
    rt_code AS fl_num,
    dt_dep,
    dt_arr,
    flights.cap AS cap,
    remain AS avail
FROM (
    SELECT
        f.id AS f_id,
        r.id AS r_id,
        r.code AS rt_code,
        f.dtime_depart AS dt_dep,
        f.dtime_arrive AS dt_arr,
        (f.max_allowed - f.booked) AS remain
    FROM
        flight_schedule AS f
    INNER JOIN routes AS r ON f.route_id=r.id
    WHERE
        DATE(f.dtime_depart) = DATE(?)
        AND r.src=?
        AND r.dest=?
) AS flights
WHERE flights.remain > 0
LIMIT 20;
