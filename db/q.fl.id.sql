SELECT
    ? AS fl_id,
    b2u(route_id) AS rt_id,
    dtime_depart AS dt_dep,
    dtime_arrive AS dt_arr,
    b2u(aircraft_id) AS ac_id
FROM flight_schedule
WHERE id=u2b(?);
