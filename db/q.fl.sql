SELECT
    b2u(f_id) AS fl_id,
    b2u(r_id) AS rt_id,
    rt_code AS fl_num,
    dt_dep,
    dt_arr,
    b2u(a_id) AS ac_id,
    fares.cap AS cap,
    remain AS avail,
    b2u(bin_af_id) AS af_id,
    cabin,
    fare
FROM (
    SELECT
        f.id AS f_id,
        r.id AS r_id,
        r.code AS rt_code,
        f.dtime_depart AS dt_dep,
        f.dtime_arrive AS dt_arr,
        f.aircraft_id AS a_id,
        (f.max_allowed - f.booked) AS remain,
        ac.capacity AS cap,
        af.id AS bin_af_id,
        af.cabin,
        af.fare
    FROM
        flight_schedule AS f
    INNER JOIN routes AS r ON f.route_id=r.id
    INNER JOIN airfares AS af ON af.flight_id=f.id
    INNER JOIN aircrafts AS ac ON ac.id=f.aircraft_id
    WHERE
        CAST (f.dtime_depart AS DATE) = CAST(? AS DATE)
        AND r.src=?
        AND r.dest=?
        AND af.cabin=?
        AND f.max_allowed - f.booked - ? >= 0
    ORDER BY
        af.fare ASC
) AS fares
WHERE fares.remain > 0
LIMIT 15;
