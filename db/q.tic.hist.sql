SELECT
    b2u(t.id) as tk_id,

    t.first_name AS first_name,
    t.last_name AS last_name,
    t.gender AS gender,
    t.birthday AS dob,

    t.flight_id AS fl_id,
    t.fare_id AS af_id,
    rt.code AS fl_num,
    fs.src,
    fs.dest,
    fs.dtime_depart AS dt_dep,
    fs.dtime_arrive AS dt_arr,
    t.tic_status AS stat,
    t.dtime_booked AS dt_booked,
    time_format(SUM(abs(timediff(fs.dtime_depart,fs.dtime_arrive))),'%H:%i') AS dur,
    af.cabin,
    af.fare
FROM
    tickets AS t
INNER JOIN airfares AS af ON t.fare_id=af.id
INNER JOIN flight_schedule AS fs ON t.flight_id=fs.id
INNER JOIN routes AS rt ON fs.route_id=rt.id
WHERE
    t.user_id=u2b(?)
    AND fs.dtime_depart < NOW()
ORDER BY fs.dtime_depart DESC;
