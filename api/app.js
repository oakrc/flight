// imports
const express       = require('express'),
      session       = require('express-session'),
      redis         = require('redis'),
      RedisStore    = require('connect-redis')(session),
      cors          = require('cors'),
      logger        = require('morgan'),
      bodyParser    = require('body-parser'),
      mysql         = require('mysql');

// setup app
const app           = express();
app.disable('x-powered-by');
app.use(logger('dev'));
var client        = redis.createClient();
app.use(session({
    secret: process.env.SESS_SECRET | '4n07h3rSeCr37',
    store: new RedisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
    saveUninitialized: false,
    resave: false,
    cookie: {
        expires: 600000,
        secure: true
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
        if(!origin || allowed_origins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.text({ type: 'text/html' }));


// Define routes
app.get('/', (req, res) => res.status(200).send({msg: 'WestFlight Airlines API',}));
app.use('/user', require('./routes/user'));
app.use('/flight', require('./routes/flight'));
app.use('/ticket', require('./routes/ticket'));

// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('WFA API Server: Listening on port', port);
});

