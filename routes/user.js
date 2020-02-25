"use strict"

const express = require('express')
const bcrypt = require('bcrypt')
const valid = require('../valid')
const query = require('../query')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

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
                        res.status(500).send({ error: 'Error registering user' })
                    }
                    else conn.beginTransaction((err) => {
                        if (err) {
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
                                conn.rollback(() => {
                                    conn.release()
                                    res.status(500).send({ error: 'Error registering user' })
                                })
                            } else {
                                conn.commit((err) => {
                                    if (err) {
                                        conn.rollback(() => {
                                            conn.release()
                                            res.status(500).send({ error: 'Error registering user' })
                                        })
                                    } else {
                                        conn.release();
                                        req.app.locals.pool.query(query.get_token_w_email, [req.body.email], (err, result) => {
                                            if (err) {
                                                res.status(500).send({ error: 'Failed to send verification email.' })
                                                return
                                            }
                                            let transporter = nodemailer.createTransport({
                                                service: 'Gmail',
                                                auth: {
                                                    user: 'westflightairlines@gmail.com',//process.env.MAIL_USER,
                                                    pass: process.env.MAIL_PASS
                                                }
                                            })
                                            transporter.verify((err,succ) => {
                                                if (err) {
                                                    res.status(500).send({ error: 'Failed to send verification email.'})
                                                    return
                                                }
                                                var mailOpts = {
                                                    from:'noreply@westflightairlines.com', //'westflightairlines@gmail.com',//process.env.MAIL_USER,//
                                                    to: req.body.email,
                                                    subject: 'WestFlight Airlines: Account Verification',
                                                    html: `<html><head></head><body><form method="DELETE" action="https://www.westflightairlines.com/api/user/token/` + encodeURIComponent(JSON.parse(JSON.stringify(result))[0].token) + `"><input type="submit" value="Verify your new WestFlight account."></form><br>If the action was not performed by you, ignore this email.</body></html>`
                                                }
                                                transporter.sendMail(mailOpts).then(
                                                    () => {
                                                        res.status(200).send({ msg: 'Sucessful Registration' })
                                                    },
                                                    () => {
                                                        res.status(500).send({ error: 'Failed to send verification email.'})
                                                    }
                                                )
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
router.delete('/token/:token', (req, res) => {
    var token = decodeURIComponent(req.params.token)
    if (token.length != 64) {
        res.status(403).send({ error:'Invalid token.' })
        return
    }
    req.app.locals.pool.getConnection((err, conn) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error.' })
            return;
        }
        conn.query(query.get_token, [token], (err, result) => {
            if (err) {
                res.status(500).send({ error: 'Internal Server Error.' })
                return;
            }
            else if (result.length != 1) {
                res.status(403).send({ error: 'Invalid token.' })
            }
            else conn.beginTransaction((err) => {
                var uid = JSON.parse(JSON.stringify(result))[0].user_id
                if (err) {
                    res.status(500).send({ error: 'Internal Server Error.' })
                }
                else conn.query(query.del_token + query.set_usr_verified, [uid, uid, token], (err, result) => {
                    if (err) {
                        conn.rollback(() => {
                            conn.release()
                            res.status(500).send({ error: 'Internal Server Error.' })
                        })
                    }
                    else conn.commit((err) => {
                        if (err) {
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
            res.status(500).send({ error: 'Failed to destroy session' })
            return;
        }
        res.status(200).end()
    })
})

module.exports = router
