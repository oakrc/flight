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
const path = require('path')

// setup app
const app = express()
app.disable('x-powered-by')
app.use(logger('dev'))

// setup session store (redis + connect-redis)
var client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
})
client.auth(process.env.REDIS_PASS)
app.use(session({
    secret: process.env.SESS_SECRET,
    store: new RedisStore({
        client: client,
        ttl: 60*60*24*15
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      //expires: new Date(Date.now() + (30 * 86400 * 1000)),
        secure: process.env.SSL === 'true'
    }
}))

// setup mysql db pool
var pool = mysql.createPool({
    host                : process.env.MYSQL_HOST,
    user                : process.env.MYSQL_USER,
    password            : process.env.MYSQL_PASS,
    database            : process.env.MYSQL_DB,
    connectionLimit     : 100,
    debug               : process.env.MYSQL_DBG === 'true',
    multipleStatements  : true
})
app.locals.pool = pool

app.use(express.static(path.join(__dirname,'/client/build')))
//app.use(cors({credentials:true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.text({ type: 'text/html' }))

// Define routes
var router = express.Router()
// configure middlewares for API only
router.use(cors({
        origin: 'www.westflightairlines.com',
        credentials: true
    })
)
router.get('/', (_, res) => res.status(200).send({msg: 'WestFlight Airlines API',}))
router.use('/user', require('./routes/user'))
router.use('/flight', require('./routes/flight'))
router.use('/ticket', require('./routes/ticket'))
router.use('/app', require('./routes/application'))
router.use('/msg', require('./routes/msg'))
app.use('/api', router)

// pass unrecognized files to React
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

// Listen
const port = process.env.PORT || 3000
app.listen(port)
