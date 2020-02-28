'use strict'
const express = require('express')
const query   = require('../query')
const valid   = require('../valid')
var   router  = express.Router()

// get ticket details
router.get('/:query', valid.uid, (req, res) => {
    var uid = req.session.uid
    if (uid === '') return
    req.app.locals.pool.query(req.params.query === 'upcoming'?
        query.tickets_upcoming:query.tickets_history,
        [uid,uid],
        (err,results)=>{
        if (err) {
            res.status(500).send({code: 'srv_err', loc: 'sel_tk_query'})
            return
        }
        res.status(200).send(results[1])
    })
})

// purchase ticket
router.put('/', valid.uid, (req, res) => {
    // is user logged in?
    var uid = req.session.uid

    // check all params
    var fl_id = req.body.fl_id,
        af_id = req.body.af_id,
        first_name = req.body.first_name,
        last_name = req.body.last_name,
        gender = req.body.gender,
        phone = req.body.phone_number,
        birthday = new Date(req.body.birthday),
        addr1 = req.body.addr1,
        addr2 = req.body.addr2,
        city = req.body.city,
        state = req.body.state,
        postal = req.body.postal,
        email = req.body.email

    // ensure MySQL NULL
    if (addr2 == '') addr2 = null
    if (phone == '') phone = null

    if (!(valid.uuid(fl_id)
        && valid.uuid(af_id)
        && valid.uuid(first_name)
        && valid.uuid(last_name)
        && valid.gender(gender)
        && (valid.phone_number(phone) || phone == '')
        && valid.email(email)
        && addr1.length > 1
        && city.length > 1
        && state.length == 2
        && valid.postal(postal))) {
        res.status(400).end()
    }
    req.app.locals.pool.query(query.buy_ticket,[
            uid,
            fl_id,
            af_id,
            first_name,
            last_name,
            gender,
            phone,
            email,
            birthday,
            addr1,
            addr2,
            city,
            state,
            postal
        ], (err, _) => {
            return err?res.status(500).end():res.status(200).end()
        }
    )
})

// check-in
router.post('/:id', valid.uid, (req, res) => {
    var uid = req.session.uid
    var tid = req.params.id;
    if (!valid.uuid(tid)) {
        res.status(400).send({error: 'Invalid Ticket ID'})
        return
    }
    req.app.locals.pool.query(query.check_in, [uid,tid], (err, result) => {
        if (err) {
            res.status(403).send({error: 'Invalid Request'})
        }
        else res.status(200).send({msg: 'Sucessfully checked-in.'})
    })
})

module.exports = router
