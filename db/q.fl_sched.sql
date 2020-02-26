SELECT
    b2u(res.f_id) AS fl_id,
    b2u(res.r_id) AS rt_id,
    res.rt_code AS fl_num,
    res.dt_dep,
    res.dt_arr,
    res.cap AS cap,
    res.remain AS avail
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
) AS res
WHERE flights.remain > 0
LIMIT 20;
