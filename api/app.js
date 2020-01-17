"use strict"
// imports
const express = require('express')
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const cors = require('cors')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')

// setup app
const app           = express()
app.disable('x-powered-by')
app.use(logger('dev'))
var client        = redis.createClient()
app.use(session({
    secret: process.env.SESS_SECRET || '4n07h3rSeCr37',
    store: new RedisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
    saveUninitialized: false,
    resave: false,
    cookie: {
        expires: new Date(Date.now() + 900000),
        secure: false //FIXME: set secure to true once https
    }
}))

// Configuring DBPool
var pool = mysql.createPool({
    host                : process.env.MYSQL_HOST,
    user                : process.env.MYSQL_USER,
    password            : process.env.MYSQL_PASS,
    database            : process.env.MYSQL_DB,
    connectionLimit     : 100,
    debug               : false,
    multipleStatements  : true
})
app.locals.pool = pool

// Configuring Middlewares
// TODO: Configure allowedOrigins
var allowed_origins = ['http://localhost:3000', 'http://oak.hopto.org', 'https://westflightairlines.com']
app.use(cors({
        origin: allowed_origins,
        credentials: true
    }
))
//app.use(cors({credentials:true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.text({ type: 'text/html' }))

// Define routes
app.get('/', (req, res) => res.status(200).send({msg: 'WestFlight Airlines API',}))
app.use('/user', require('./routes/user'))
app.use('/flight', require('./routes/flight'))
app.use('/ticket', require('./routes/ticket'))
app.use('/application', require('./routes/application'))

// Listen
const port = process.env.PORT || 3000
app.listen(port)
