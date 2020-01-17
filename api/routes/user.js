"use strict"

const express = require('express')
const bcrypt = require('bcrypt')
const valid = require('../valid')
const query = require('../query')
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
    var user_exists = result[0].exists
    if (user_exists) {
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
        req.app.locals.pool.query(query.register_user, [
          req.body.first_name,
          // req.body.middle_name,
          req.body.last_name,
          new Date(req.body.birthday),
          req.body.gender,
          req.body.phone_number,
          req.body.email,
          hashed
        ], (err, _) => {
          if (err) {
            res.status(500).send({ error: 'Error registering user' })
          } else res.status(200).send({ msg: 'Sucessful Registration' })
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
        res.status(400).send({ error: 'Authentication Failure' })
        return
      }
      pw_hash = result[0].pw
      uid = result[0].user_uid
      const comp = bcrypt.compareSync(Buffer.from(req.body.password, 'base64').toString(), pw_hash)
      if (comp) {
        req.session.uid = uid
        res.status(200).end()
      } else {
        res.status(401).send({ error: 'Authentication Failure' })
      }
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
      res.status(500).send({ error: 'Failed to destroy session'})
      return;
    }
    res.status(200).end()
  })
})

module.exports = router
