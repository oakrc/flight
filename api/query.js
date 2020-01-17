// minimized version of query_flights.sql
// 12/31 16:08
module.exports = {
    search_flights    : `SELECT BIN_TO_UUID(f_id) AS fl_id, BIN_TO_UUID(r_id) AS rt_id, rt_code, dt_dep, dt_arr, BIN_TO_UUID(a_id) AS ac_id, fares.cap AS capacity, remain AS available, BIN_TO_UUID(bin_af_id) AS af_id, cabin, fare FROM ( SELECT f.id AS f_id, r.id AS r_id, r.code AS rt_code, f.dtime_depart AS dt_dep, f.dtime_arrive AS dt_arr, f.aircraft_id AS a_id, (f.max_allowed - f.booked) AS remain, ac.capacity AS cap, af.id AS bin_af_id, af.cabin, af.fare FROM flight_schedule AS f INNER JOIN routes AS r ON f.route_id=r.id INNER JOIN airfares AS af ON af.flight_id=f.id INNER JOIN aircrafts AS ac ON ac.id=f.aircraft_id WHERE DATE(f.dtime_depart) = DATE(?) AND r.src=? AND r.dest=? AND af.cabin=? AND f.max_allowed - f.booked - ? > 0 ORDER BY af.fare ASC ) AS fares LIMIT 100; `,
    flight_by_id      : `SELECT ? AS fl_id, BIN_TO_UUID(route_id) AS rt_id, dtime_depart AS dt_dep, dtime_arrive AS dt_arr, BIN_TO_UUID(aircraft_id) AS ac_id FROM flight_schedule WHERE id=UUID_TO_BIN(?); `,
    get_user_data     : `SELECT ? AS uid,email,phone_number,first_name,last_name,birthday,gender,tier,miles FROM users WHERE id=UUID_TO_BIN(?);`,
    add_dummy_flights : `CALL add_dummy_flights(?,?,?);`,
    tickets_upcoming  : `SELECT BIN_TO_UUID(t.id) as tk_id, t.flight_id AS fl_id, t.fare_id AS af_id, rt.code AS fl_num, fs.src, fs.dest, fs.dtime_depart AS dt_dep, fs.dtime_arrive AS dt_arr, t.tic_status AS stat, t.dtime_booked AS dt_booked, time_format(SUM(abs(timediff(fs.dtime_depart,fs.dtime_arrive))),'%H:%i') AS dur, af.cabin, af.fare FROM tickets AS t INNER JOIN airfares AS af ON t.fare_id=af.id INNER JOIN flight_schedule AS fs ON t.flight_id=fs.id INNER JOIN routes AS rt ON fs.route_id=rt.id INNER JOIN passengers AS ps ON ps.user_id=UUID_TO_BIN(?) AND t.passenger_id=ps.id WHERE t.user_id=UUID_TO_BIN(?) AND fs.dtime_depart >= NOW() ORDER BY fs.dtime_depart ASC;`,
    tickets_history   : `SELECT BIN_TO_UUID(t.id) as tk_id, t.flight_id AS fl_id, t.fare_id AS af_id, rt.code AS fl_num, fs.src, fs.dest, fs.dtime_depart AS dt_dep, fs.dtime_arrive AS dt_arr, t.tic_status AS stat, t.dtime_booked AS dt_booked, time_format(SUM(abs(timediff(fs.dtime_depart,fs.dtime_arrive))),'%H:%i') AS dur, af.cabin, af.fare FROM tickets AS t INNER JOIN airfares AS af ON t.fare_id=af.id INNER JOIN flight_schedule AS fs ON t.flight_id=fs.id INNER JOIN routes AS rt ON fs.route_id=rt.id INNER JOIN passengers AS ps ON ps.user_id=UUID_TO_BIN(?) AND t.passenger_id=ps.id WHERE t.user_id=UUID_TO_BIN(?) AND fs.dtime_depart < NOW() ORDER BY fs.dtime_depart DESC;`,
    user_exists       : `SELECT COUNT(*) AS exist FROM users WHERE email=?;`,
    register_user     : `CALL register_user(?,?,?,?,?,?,?);`,
    get_user_id_pw    : `SELECT BIN_TO_UUID(id) AS user_uid, pw FROM westflight.users WHERE email=?;`,
    buy_ticket        : `CALL buy_ticket(?,?,?,?,?,?,?,?,?,?,?,?,?);`,
    get_jobs          : `SELECT * FROM jobs;`,
    add_job_app       : `CALL add_job_app(?,?,?,?,?,?);`,
    check_in          : `CALL check_in(?,?);`
}
