'use strict'
const express = require('express')
const query   = require('../query')
const valid   = require('../valid')
const sg      = require('@sendgrid/mail')
sg.setApiKey(process.env.SG_API_KEY)
var   router  = express.Router()

// get ticket details
router.get('/:query', valid.uid, (req, res) => {
    var uid = req.session.uid
    req.app.locals.pool.query(
        req.params.query === 'upcoming'?
        query.tickets_upcoming:query.tickets_history,
        [uid],
        (err,result)=>{
        if (err) {
            console.log(err)
            res.status(500).send({error: 'Internal Server Error'})
            return
        }
        res.status(200).send(JSON.parse(JSON.stringify(result)))
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
        && valid.first_last(first_name)
        && valid.first_last(last_name)
        && valid.gender(gender)
        && (valid.phone_number(phone) || phone == null)
        && valid.email(email)
        && addr1.length > 1
        && city.length > 1
        && state.length == 2
        && valid.postal(postal))) {
        res.status(400).end()
        return
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
        ], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).end()
                return
            }
            
            req.app.locals.pool.query(
                query.get_conf,
                [uid,first_name,last_name,af_id],
                (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({ error: 'Failed to send confirmation email.'})
                        return
                    }
                    if (result.length < 1) {
                        console.log('Confirmation Number not found')
                        res.status(500).send({ error: 'Failed to send confirmation email' })
                        return
                    }
                    var conf = JSON.parse(JSON.stringify(result))[0].conf
                    var msg = {
                        from: process.env.MAIL_USER,
                        to: req.body.email,
                        subject: 'WestFlight Airlines: Account Verification',
                        html: `<html> <head> <link href="https://fonts.googleapis.com/css?family=Rubik&display=swap" rel="stylesheet"> <style>body{margin: 0; font-family: 'Rubik'; display: flex; flex-direction: column; align-items: center; margin-top: 5vh; color: white;}div{height: 80vh; padding: 5vh 10vw; display: flex; flex-direction: column; align-items: center; background-color: #005aa7; border-radius: 1vw; height: fit-content;}a{color: #005aa7; text-decoration: none;}</style> </head> <body> <div> <img src="https://www.westflightairlines.com/static/media/logo3.311095c9.png" alt="Logo"> <h1>West Flight Airlines</h1> <h3>Thank you for booking a flight!</h3> <a href="https://www.westflightairlines.com/checkin">Check-in</a><br>Confirmation Number:` + conf + `</div></body></html>`
                    }
                    sg.send(msg).then(
                        () => {
                            res.status(200).end()
                        },
                        () => {
                            res.status(500).send({ error: 'Failed to send confirmation email.'})
                        }
                    )
                }
            )
        }
    )
})

router.post('/check-in', (req, res) => {
    var conf    = req.body.conf,
        first   = req.body.first_name,
        last    = req.body.last_name

    if (!(conf.length == 6
        && valid.first_last(first)
        && valid.first_last(last)
    )) {
        res.status(400).send({ error: 'Invalid request' })
    }
    req.app.locals.pool.query(query.check_in, [conf,first,last], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).send({error: 'Invalid Request'})
        }
        else res.status(200).send({msg: 'Sucessfully checked-in.'})
    })
})

module.exports = router
