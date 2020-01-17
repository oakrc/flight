SELECT 
    ? AS fl_id,
    BIN_TO_UUID(route_id) AS rt_id,
    dtime_depart AS dt_dep,
    dtime_arrive AS dt_arr,
    BIN_TO_UUID(aircraft_id) AS ac_id 
FROM flight_schedule
WHERE id=UUID_TO_BIN(?);
