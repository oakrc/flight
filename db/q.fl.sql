SELECT
    f.id AS fl_id,
    r.id AS rt_id,
    r.code AS fl_num,
    f.dtime_depart AS dt_dep,
    f.dtime_arrive AS dt_arr,
    (f.max_allowed - f.booked) AS avail,
    b2u(af.id) AS af_id,
    af.cabin AS cabin,
    af.fare As fare
FROM flight_schedule AS f
INNER JOIN routes AS r ON r.id=f.route_id
INNER JOIN airfares AS af ON af.flight_id=f.id
WHERE
    f.dtime_depart >= ?
    AND f.dtime_depart < DATE_ADD(?, INTERVAL 1 DAY)
    AND r.src=?
    AND r.dest=?
    AND af.cabin=?
    AND f.max_allowed - f.booked - ? >= 0
ORDER BY
    af.fare ASC
LIMIT 30;
