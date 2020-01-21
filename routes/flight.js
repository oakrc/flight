"use strict"

const express = require('express')
const query   = require('../query')
var   router  = express.Router()

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
}

// get details about flight
router.get('/:id', (req, res) => {
    var rid = req.params.id
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rid)) {
        res.status(400).send({code: 'bad_uuid'})
        return
    }
    req.app.locals.pool.query(query.flight_by_id, [rid,rid], (err, result) => {
        if (err) {
            res.status(500).send({code: 'srv_err', loc: 'sel_flight_id', msg: err.message})
            return
        }
        if (result.length < 1) {
            res.status(404).send({code: 'flight_not_found'})
            return
        }
        res.status(200).send(result[0])
    })
})

// query flight by date range, src, dest, ...
router.get('/', (req, res) => {
    var date        = new Date(req.query.date),
        src         = (''+req.query.depart).toUpperCase(),
        dest        = (''+req.query.arrive).toUpperCase(),
        cabin       = (''+req.query.cabin).toUpperCase(),
        passengers  = parseInt(req.query.passengers,10)
    console.log('src',src)
    console.log('dest',dest)

    // check
    var codes = []
    if (src == '' || dest == '') codes.push('no_src_dest')
    if (src == dest) codes.push('src_eq_dest')
    if (passengers < 1 || passengers > 9 || isNaN(passengers)) codes.push('bad_psngr_cnt')
    if (codes.length) {
        res.status(400).send({code: codes})
        return
    }

    console.log('date',date)
    // query
    req.app.locals.pool.query(query.add_dummy_flights+query.search_flights,
        [src,dest,date,date,src,dest,cabin,passengers],
        (err, result) => {
            if (err) {
                res.status(500).send({code: 'srv_err', loc: 'sel_fl', details: err.message})
                console.log(err.message)
            }
            else res.status(200).send(result[1])
    })
})

module.exports = router
