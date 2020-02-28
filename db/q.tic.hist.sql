SELECT
    b2u(t.id) as tk_id,

    t.first_name AS first_name,
    t.last_name AS last_name,
    t.gender AS gender,
    t.birthday AS dob,

    b2u(t.flight_id) AS fl_id,
    b2u(t.fare_id) AS af_id,
    rt.code AS fl_num,
    rt.src,
    rt.dest,
    fs.dtime_depart AS dt_dep,
    fs.dtime_arrive AS dt_arr,
    t.tic_status AS stat,
    t.dtime_booked AS dt_booked,
    time_format(SUM(abs(timediff(fs.dtime_depart,fs.dtime_arrive))),'%H:%i') AS dur,
    af.cabin,
    af.fare
FROM
    tickets AS t
JOIN airfares AS af ON af.id=t.fare_id
JOIN flight_schedule AS fs ON fs.id=t.flight_id
JOIN routes AS rt ON rt.id=fs.route_id
WHERE
    t.user_id=u2b(?)
    AND fs.dtime_depart < NOW()
ORDER BY fs.dtime_depart DESC;
