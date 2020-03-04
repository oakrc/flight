"use strict"

const express = require('express')
const valid = require('../valid')
const sg = require('@sendgrid/mail')
sg.setApiKey(process.env.SG_API_KEY)

var router = express.Router()

router.post('/', (req, res) => {
    var fname     = req.body.first_name,
        lname     = req.body.last_name,
        email     = req.body.email,
        phone     = req.body.phone,
        subject   = req.body.subject,
        message   = req.body.message
    if (valid.first_last(fname)
            && valid.first_last(lname)
            && valid.email(email)
            && valid.phone_number(phone)) {
        var msg = {
            from: process.env.MAIL_USER,
            to: req.body.email,
            subject: 'Support: ' + subject,
            text: message + '\n\nSupport Info: ' + '\nName: ' + fname + ' ' + lname
                            + '\nPhone Number: ' + phone
                            + '\nEmail: ' + email
        }
        sg.send(msg).then(
            () => {
                res.status(200).send({ msg: 'Message sent' })
            },
            () => {
                res.status(500).send({ error: 'Failed to send message.' })
            }
        )
    }
    else {
        res.status(400).send({error: 'Invalid request format'})
    }
})
module.exports = router
