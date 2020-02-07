#!/bin/bash
rm -f schema.sql
PROJ_ROOT=`git root`
DEBUG=$1
add() {
    cat $PROJ_ROOT/db/$@
    if [[ $DEBUG == 'dbg' ]]; then
        echo "SELECT '"$@"';"
    fi
}

add s._.header.sql

add s.t.ac.sql # aircraft
add s.t.rt.sql # routes
add s.t.fl.sql # flight_schedule
add s.t.af.sql # airfares
add s.t.us.sql # users
add s.t.vt.sql # user verification token
add s.t.tk.sql # tickets
add s.t.ap.sql # airports

add s.i.ap.sql # insert nearby airports

add s.e.expire_token.sql

echo 'DELIMITER //'

add s.f.gen_uuid.sql
add s.f.b2u.sql
add s.f.u2b.sql

add s.p.register_user.sql
add s.p.add_aircraft.sql
add s.p.add_flight.sql
add s.p.buy_ticket.sql
add s.p.check_in.sql

add s.p.add_dummy_aircrafts.sql
add s.p.add_dummy_flights.sql
add s.p.add_routes.sql

add s._.footer.sql
