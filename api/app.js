// imports
const express       = require('express');
const session       = require('express-session');
const redis         = require('redis');
const RedisStore   = require('connect-redis')(session);
const client        = redis.createClient();
const fs            = require('fs');
const cors          = require('cors');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const mysql         = require('mysql');
const bcrypt        = require('bcrypt');

// setup app
const app           = express();
const salt_rounds   = 12;
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(session({
    secret: process.env.SESS_SECRET | '4n07h3rSeCr37',
    store: new RedisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
    saveUninitialized: false,
    resave: false
    cookie: {
        expires: 600000
    }
}));

// Configuring DBPool
var pool = mysql.createPool({
    host            : process.env.MYSQL_HOST,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASS,
    database        : process.env.MYSQL_DB,
    connectionLimit : 50,
    debug           : false
})
app.locals.pool = pool;

// Configuring Middlewares
// TODO: Configure allowedOrigins
var allowed_origins = ['http://localhost:3000', 'http://yourapp.com'];
app.use(cors({
    origin: (origin, callback) => {    // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);    
        if(allowed_origins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use((req,res,next) => {
    console.log('[', Date.now(), ']', ' HTTP ', req.method, ' ', req.url);
    next();
});


/*// JWT Auth0 Middleware
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://wfa.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'td6HeYvh1OGiH7lveZAXhZN43Zb0ZF0Y',
    issuer: `https://wfa.auth0.com/`,
    algorithms: ['RS256']
});*/

// Define routes
app.get('/', (req, res) => res.status(200).send({msg: 'WestFlight Airlines API',}));
app.get('/', (req, res) => res.status(404).end());

// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('WFA API Server: Listening on port', port);
});

