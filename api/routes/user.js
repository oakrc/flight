const express = require('express'),
      bcrypt  = require('bcrypt');
var   router  = express.Router();

// register
router.put('/', (req, res) => {
    function check_password(pwd) {
        var reasons = [];
        if (!/^[a-zA-Z0-9!@#$%^&*()_+-=/.,;']{8,}$/.check(pwd)) reasons.push('Illegal characters.');
        if (pwd.replace(/[^A-Z]/g, "").length < 1) reasons.push('Include 1 or more upper-case letters.');
        if (pwd.replace(/[^a-z]/g, "").length < 1) reasons.push('Include 1 or more lower-case letters.');
        if (pwd.replace(/[^0-9]/g, "").length < 1) reasons.push('Include 1 or more numerals.');
        if (pwd.replace(/[^#$%^&*()_+-=/.,;']/g, "").length < 1) reasons.push('Include 1 or more special characters');
        return reasons;
    }
    function check_email(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.check(email)?'':'Invalid email address.';
    }

    // register user
    const salt_rounds   = 12;
    let plain_pw = Buffer.from(req.body.password).toString('ascii');
    let hashed = '';

    // checks login & password against requirements
    let pwd_reasons = check_password(plain_pw);
    if (pwd_reason.length > 0) { // only ascii accepted
        res.status('404').send({code: 'pwd_req_fail', reasons: pwd_reasons});
        return;
    }
    let uname_reasons = check_email(req.email);
    if (uname_reasons.length > 0){
        res.status('404').send({code: 'email_req_fail', reasons: uname_reasons})
    }

    // checks if user already exists
    let user_exists = false;
    req.app.locals.pool.query("SELECT COUNT(*) AS exists FROM users WHERE email=?",[req.body.email],(err, result) => {
        if (err){ 
            res.status(500).send({code: 'srv_err', loc: 'select_users'});
            throw err;
        }
        user_exists = result[0].exists;
    });
    if (user_exists) {
        res.status(403).send({code: 'user_exists'});
        return;
    }

    // hash & store password
    bcrypt.hash(plain_pw, salt_rounds, (err, hash) => {
        if (err){ 
            res.status(500).send({code: 'srv_err', loc: 'gen_hash'});
            throw err;
        }
        hashed = hash; 
    });

    // last minute checks & fixing before inserting
    var codes = [];
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.check(req.body.first_name)) codes.push('reg_fname_fail');
    // allow spaces in middle names (for people with multiple given names)
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/.check(req.body.middle_name)) codes.push('reg_mname_fail');
    if (req.body.middle_name == '') req.body.middle_name = null;
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.check(req.body.last_name)) codes.push('reg_lname_fail');
    if (!(req.body.birth_year < 1900 && (new Date().getFullYear() - req.body.birth_year > 18)))
        codes.push('reg_byear_fail');
    if (req.body.gender != 'M' && req.body.gender != 'F' && req.body.gender != 'O') codes.push('reg_gender_fail');
    if (req.body.phone_number == '') req.body.phone_number = null;
    else if (/^[0-9]{7,15}$/.check(req.body.phone_number)) 
        codes.push('reg_phone_fail');
    if (codes.length > 0) {
        res.status(400).send({code: codes});
        return;
    }
    if (hashed.length > 1) {
        req.app.locals.pool.query('CALL register_user(?,?,?,?,?,?,?,?);', [
            req.body.first_name,
            req.body.middle_name,
            req.body.last_name,
            req.body.birth_year,
            req.body.gender,
            req.body.phone_number,
            req.body.email,
            hashed
        ], (err, results) => {
            if (err) {
                res.status(500).send({code: 'srv_err', loc: 'reg_user'});
                throw err;
            } 
        });
    } else res.status(500).end();
    res.status(200).send({code: 'reg_success'});
});
// login
router.post('/', (req, res) => {
    var pw_hash = '';
    var uid = '';
    var q_result = {};
    var comp_res = false;

    req.app.locals.pool.query('SELECT BIN_TO_UUID(id) AS id,pw FROM users WHERE email=?;',
        [req.body.email],
        (err, result) => {
            if (err) {
                res.status(500).send({code: 'srv_err', loc: 'sel_pw'});
                throw err;
            }
            q_result = result[0];
    });
    if (q_result.length < 1) {
        res.status(404).send({code: 'user_not_found'});
        return;
    }

    pw_hash = q_result.pw;
    uid = q_result.id;

    bcrypt.compare(Buffer.from(req.body.password).toString('ascii'), pw_hash, function(err, comp) {
        if (err) {
            res.status(500).send({code: 'srv_err', loc: 'comp_pw'});
            throw err;
        }
        comp_res = comp;
    });
    if (comp_res) {
        req.session.uid = uid;
        res.status(200).end();
    } else {
        res.status(401).send({code: 'auth_fail'});
    }
});
// get data
router.get('/', (req, res) => {
    if (!req.session.uid) {
        res.status(403).send({code: 'no_sess'});
        return;
    }
    var user_data = {};
    var q_result = [];
    req.app.locals.pool.query('SELECT ?,email,phone_number,first_name,middle_name,last_name,birth_year,gender WHERE id=UUID_TO_BIN(?);', [req.session.uid,req.session.uid], (err, result) => {
        if (err) {
            res.status(500).send({code: 'srv_err', loc: 'get_user_data'});
            throw err;
        }
        q_result = result;
    });
    if (q_result.length != 1) {
        res.status(401).send({code: 'uid_not_found'});
        return;
    }
    user_data = q_result[0];
    res.status(200).send(user_data);
})
// logout
router.delete('/', (req, res) => {
    req.session.destroy();
});
module.exports = router;
