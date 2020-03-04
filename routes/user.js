"use strict"

const express = require('express')
const bcrypt = require('bcrypt')
const valid = require('../valid')
const query = require('../query')
const crypto = require('crypto')
const sg = require('@sendgrid/mail')

sg.setApiKey(process.env.SG_API_KEY)
var router = express.Router()

// register
router.put('/', (req, res) => {
    // register user
    const salt_rounds = 12
    const plain_pw = Buffer.from(req.body.password, 'base64').toString()

    // checks login & password against requirements
    const invalid_password = valid.password(plain_pw)
    if (invalid_password.length) { // only ascii accepted
        res.status(400).send({ error: 'Password Requirements Unmet', reasons: invalid_password })
        return
    }
    if (!valid.email(req.body.email)) {
        res.status(400).send({ error: 'Invalid Email' })
        return
    }

    // checks if user already exists
    req.app.locals.pool.query(query.user_exists, [req.body.email], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send({ error: 'Error registering user' })
            return
        }
        var user_exists = JSON.parse(JSON.stringify(result))[0].exist
        if (user_exists >= 1) {
            res.status(403).send({ error: 'Email already registered' })
            return
        }

        // hash & store password
        bcrypt.hash(plain_pw, salt_rounds, (err, hashed) => {
            if (err) {
                console.log(err)
                res.status(500).send({ error: 'Error registering user' })
                return
            }
            // last minute checks & fixing before inserting
            var codes = []
            // calculate age
            var age = Math.abs(new Date(Date.now() - new Date(req.body.birthday).getTime()).getUTCFullYear() - 1970)
            if (age < 18) codes.push('Underage')

            if (!valid.first_last(req.body.first_name)) codes.push('Invalid First Name')
            if (!valid.first_last(req.body.last_name)) codes.push('Invalid Last Name')
            if (req.body.gender != 'M' && req.body.gender != 'F' && req.body.gender != 'O' && req.body.gender != 'P') codes.push('Invalid Gender')
            if (!valid.phone_number(req.body.phone_number)) { codes.push('Invalid Phone Number') }
            if (codes.length > 0) {
                res.status(400).send({ error: codes })
                return
            }
            if (hashed.length > 1) {
                req.app.locals.pool.getConnection((err,conn) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({ error: 'Error registering user' })
                    }
                    else conn.beginTransaction((err) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ error: 'Error registering user' })
                        }
                        else conn.query(query.register_user, [
                            req.body.first_name,
                            req.body.last_name,
                            new Date(req.body.birthday),
                            req.body.gender,
                            req.body.phone_number,
                            req.body.email,
                            hashed
                        ], (err, _) => {
                            if (err) {
                                console.log(err)
                                conn.rollback(() => {
                                    conn.release()
                                    res.status(500).send({ error: 'Error registering user' })
                                })
                            } else {
                                conn.commit((err) => {
                                    if (err) {
                                        console.log(err)
                                        conn.rollback(() => {
                                            conn.release()
                                            res.status(500).send({ error: 'Error registering user' })
                                        })
                                    } else {
                                        conn.release();
                                        req.app.locals.pool.query(query.get_token_w_email, [req.body.email], (err, result) => {
                                            if (err) {
                                                console.log(err)
                                                res.status(500).send({ error: 'Failed to send verification email.' })
                                                return
                                            }
                                            const msg = {
                                                from: process.env.MAIL_USER, //'westflightairlines@gmail.com',//process.env.MAIL_USER,//
                                                to: req.body.email,
                                                subject: 'WestFlight Airlines: Account Verification',
                                                html: `<html><head></head><body><form method="GET" action="https://www.westflightairlines.com/api/user/token/` + + `"><input type="submit" value="Verify your new WestFlight account."></form><br>If the action was not performed by you, ignore this email.</body></html>`
                                                html: `<html><head><link href="https://fonts.googleapis.com/css?family=Rubik&display=swap" rel="stylesheet"><style>body{margin: 0; padding-top: 5vh; font-family: 'Rubik', 'Sans-serif'; display: flex; justify-content: center; color: white;}h1{margin-bottom: 0;}h3{margin-top: 1.5vh;}a{margin: 2vh 0 0 0; width: fit-content; padding: 2vh 2vw; background-color: white; text-decoration: none; color: #005aa7; border-radius: 0.5vw;}div{margin: 0; display: flex; flex-direction: column; align-items: center; height: 80vh; padding: 5vh 10vw; box-sizing: border-box; background-color: #005aa7; border-radius: 1vw;}</style></head><body><div><img src="https://www.westflightairlines.com/static/media/logo3.311095c9.png" alt="Logo"><h1>West Flight Airlines</h1><h3>Thank you for registering at West Flight, `+req.body.first_name+`</h3><a href="https://www.westflightairlines.com/api/user/token/`+encodeURIComponent(JSON.parse(JSON.stringify(result))[0].token)+`">Verify Account</a> <br>If you did not perform this action, please ignore this email. </div></html>`
                                            }
                                            sg.send(msg,false,(err,result)=>{
                                                if (err) {
                                                    console.log(err)
                                                    console.log(err)
                                                    res.status(500).send({ error: 'Failed to send verification email.'})
                                                }
                                                else 
                                                    res.status(200).send({ msg: 'Sucessful Registration' })
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    })
                })
            } else res.status(500).end()
        })
    })
})

// login
router.post('/', (req, res) => {
    var pw_hash = ''
    var uid = ''
    req.app.locals.pool.query(query.get_user_id_pw,
        [req.body.email],
        (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ error: 'Error logging in' })
                return
            }
            if (result.length != 1) {
                res.status(401).send({ error: 'Authentication Failure' })
                return
            }
            var js_res = JSON.parse(JSON.stringify(result))
            pw_hash = js_res[0].pw
            uid = js_res[0].user_uid
            if (js_res[0].verified != 1) {
                res.status(423).send({ error: 'Account not verified.' })
                return
            }
            bcrypt.compare(Buffer.from(req.body.password, 'base64').toString(), pw_hash, (err, comp) => {
                if (err) {
                    console.log(err)
                    res.status(500).send({ error: 'Internal Server Error.' })
                }
                if (comp) {
                    req.session.uid = uid
                    res.status(200).end()
                } else {
                    res.status(401).send({ error: 'Authentication Failure' })
                }
            })
        }
    )
})

// verify account
router.get('/token/:token', (req, res) => {
    var token = decodeURIComponent(req.params.token)
    if (token.length != 64) {
        res.status(403).send({ error:'Invalid token.' })
        return
    }
    req.app.locals.pool.getConnection((err, conn) => {
        if (err) {
            console.log(err)
            res.status(500).send({ error: 'Internal Server Error.' })
            return;
        }
        conn.query(query.get_token, [token], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ error: 'Internal Server Error.' })
                return;
            }
            else if (result.length != 1) {
                res.status(403).send({ error: 'Invalid token.' })
            }
            else conn.beginTransaction((err) => {
                var uid = JSON.parse(JSON.stringify(result))[0].user_id
                if (err) {
                    console.log(err)
                    res.status(500).send({ error: 'Internal Server Error.' })
                }
                else conn.query(query.del_token + query.set_usr_verified, [uid, token, uid], (err, result) => {
                    if (err) {
                        console.log(err)
                        conn.rollback(() => {
                            conn.release()
                            res.status(500).send({ error: 'Internal Server Error.' })
                        })
                    }
                    else conn.commit((err) => {
                        if (err) {
                            console.log(err)
                            conn.rollback(() => {
                                conn.release()
                                res.status(500).send({ error: 'Internal Server Error.' })
                            })
                        }
                        else {
                            conn.release()
                            res.status(200).send({ msg: 'Account Verified.' })
                        }
                    })
                })
            })
        })
    })
})

// get data
router.get('/', valid.uid, (req, res) => {
    var uid = req.session.uid
    req.app.locals.pool.query(query.get_user_data,
        [req.session.uid, req.session.uid],
        (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ error: 'Internal Server Error' })
                return
            }
            if (result.length != 1) {
                res.status(401).send({ error: 'Error fetching user data' })
                return
            }
            res.status(200).send(result[0])
        }
    )
})

// logout
router.delete('/', valid.uid, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            res.status(500).send({ error: 'Failed to destroy session' })
            return;
        }
        res.status(200).end()
    })
})

module.exports = router
