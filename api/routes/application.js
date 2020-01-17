"use strict"
const express = require('express')
const query = require('../query')
const valid = require('../valid')
var router = express.Router()

router.post('/', (req, res) => {
    var fname = req.body.first_name,
        lname = req.body.last_name,
        dob = new Date(req.body.birthday),
        phone = req.body.phone_number,
        email = req.body.email,
        jid = req.body.jid
    var age = Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970)

    if (!(valid.first_last(fname)
        && valid.first_last(lname)
        && age >= 18
        && valid.phone_number(phone)
        && valid.email(email))) {
        req.app.locals.pool.query(
            query.add_job_app,
            [jid,fname,lname],
            (err, result) => {
                if (err) {
                    res.status(500).json({error: 'Internal Server Error'})
                }
                else res.status(200).json(result)
            }
        )
    }
    else res.status(400).json({error: 'Invalid request.'});
})

module.exports = router
