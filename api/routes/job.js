const express = require('express');
const query = require('../query');
var router  = express.Router();

router.get('/', (req, res) => {
    req.app.locals.pool.query(query.get_jobs, (err, results) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
        }
        else res.status(200).send(results);
    });
});
