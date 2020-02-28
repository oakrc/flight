// minimized version of query_flights.sql
// 12/31 16:08
module.exports = {
    // /api/flight
    search_flights    : `SELECT b2u(f_id) AS fl_id, b2u(r_id) AS rt_id, rt_code AS fl_num, dt_dep, dt_arr, b2u(a_id) AS ac_id, fares.cap AS cap, remain AS avail, b2u(bin_af_id) AS af_id, cabin, fare FROM ( SELECT f.id AS f_id, r.id AS r_id, r.code AS rt_code, f.dtime_depart AS dt_dep, f.dtime_arrive AS dt_arr, f.aircraft_id AS a_id, (f.max_allowed - f.booked) AS remain, ac.capacity AS cap, af.id AS bin_af_id, af.cabin, af.fare FROM flight_schedule AS f INNER JOIN routes AS r ON f.route_id=r.id INNER JOIN airfares AS af ON af.flight_id=f.id INNER JOIN aircrafts AS ac ON ac.id=f.aircraft_id WHERE f.dtime_depart >= ? AND f.dtime_depart < DATE_ADD(?, INTERVAL 1 DAY) AND r.src=? AND r.dest=? AND af.cabin=? AND f.max_allowed - f.booked - ? >= 0 ORDER BY af.fare ASC ) AS fares WHERE fares.remain > 0 LIMIT 15; `,
    get_fl_sched      : `SELECT f.id AS fl_id, r.id AS rt_id, r.code AS fl_num, f.dtime_depart AS dt_dep, f.dtime_arrive AS dt_arr, (f.max_allowed - f.booked) AS avail, b2u(af.id) AS af_id, af.cabin AS cabin, af.fare As fare FROM flight_schedule AS f INNER JOIN routes AS r ON r.id=f.route_id INNER JOIN airfares AS af ON af.flight_id=f.id WHERE f.dtime_depart >= ? AND f.dtime_depart < DATE_ADD(?, INTERVAL 1 DAY) AND r.src=? AND r.dest=? AND af.cabin=? AND f.max_allowed - f.booked - ? >= 0 ORDER BY af.fare ASC LIMIT 30;`,
    flight_by_id      : `SELECT ? AS fl_id, b2u(route_id) AS rt_id, dtime_depart AS dt_dep, dtime_arrive AS dt_arr, b2u(aircraft_id) AS ac_id FROM flight_schedule WHERE id=u2b(?); `,
    add_dummy_flights : `CALL add_dummy_flights(?,?,?);`,

    // /api/user
    get_user_data     : `SELECT ? AS uid,email,phone_number,first_name,last_name,birthday,gender,tier,miles FROM users WHERE id=u2b(?);`,
    user_exists       : `SELECT COUNT(*) AS exist FROM users WHERE email=?;`,
    register_user     : `CALL register_user(?,?,?,?,?,?,?);`,
    get_user_id_pw    : `SELECT b2u(id) AS user_uid, pw, verified FROM users WHERE email=?;`,
    get_token         : `SELECT b2u(user_id) AS user_id, token FROM verification_tokens WHERE token=?;`,
    get_token_w_email : `SELECT vt.token FROM verification_tokens AS vt INNER JOIN users AS us ON vt.user_id=us.id WHERE us.email=?;`,
    del_token         : `DELETE FROM verification_tokens WHERE user_id=u2b(?) AND token=?;`,
    set_usr_verified  : `UPDATE users SET verified=1 WHERE id=u2b(?);`,

    // /api/ticket
    tickets_upcoming  : `SELECT b2u(t.id) as tk_id, t.first_name AS first_name, t.last_name AS last_name, t.gender AS gender, t.birthday AS dob, t.flight_id AS fl_id, t.fare_id AS af_id, rt.code AS fl_num, fs.src, fs.dest, fs.dtime_depart AS dt_dep, fs.dtime_arrive AS dt_arr, t.tic_status AS stat, t.dtime_booked AS dt_booked, time_format(SUM(abs(timediff(fs.dtime_depart,fs.dtime_arrive))),'%H:%i') AS dur, af.cabin, af.fare FROM tickets AS t INNER JOIN airfares AS af ON t.fare_id=af.id INNER JOIN flight_schedule AS fs ON t.flight_id=fs.id INNER JOIN routes AS rt ON fs.route_id=rt.id WHERE t.user_id=u2b(?) AND fs.dtime_depart >= NOW() ORDER BY fs.dtime_depart ASC; `,
    tickets_history   : `SELECT b2u(t.id) as tk_id, t.first_name AS first_name, t.last_name AS last_name, t.gender AS gender, t.birthday AS dob, t.flight_id AS fl_id, t.fare_id AS af_id, rt.code AS fl_num, fs.src, fs.dest, fs.dtime_depart AS dt_dep, fs.dtime_arrive AS dt_arr, t.tic_status AS stat, t.dtime_booked AS dt_booked, time_format(SUM(abs(timediff(fs.dtime_depart,fs.dtime_arrive))),'%H:%i') AS dur, af.cabin, af.fare FROM tickets AS t INNER JOIN airfares AS af ON t.fare_id=af.id INNER JOIN flight_schedule AS fs ON t.flight_id=fs.id INNER JOIN routes AS rt ON fs.route_id=rt.id WHERE t.user_id=u2b(?) AND fs.dtime_depart < NOW() ORDER BY fs.dtime_depart DESC;`,
    buy_ticket        : `CALL buy_ticket(?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
    check_in          : `CALL check_in(?,?,?);`,
    get_conf          : `SELECT conf FROM tickets WHERE user_id = u2b(uid) and first_name=? AND last_name=? AND birthday=?`
}
