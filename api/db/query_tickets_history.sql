SELECT 
    BIN_TO_UUID(t.id) as tk_id,
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
INNER JOIN passengers AS ps ON ps.user_id=UUID_TO_BIN(?) AND t.passenger_id=ps.id
WHERE
    t.user_id=UUID_TO_BIN(?)
    AND fs.dtime_depart < NOW()
ORDER BY fs.dtime_depart DESC;
