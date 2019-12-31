var express = require('express'),
    router  = express.Router();

router.post('/', (req, res) => {
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
    let plain_pw = Buffer.from(res.password).toString();
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
    req.app.locals.pool.query("SELECT COUNT(*) AS exists FROM users WHERE email=?",[req.email],(err, result) => {
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
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.check(req.first_name)) codes.push('reg_fname_fail');
    // allow spaces in middle names (for people with multiple given names)
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/.check(req.middle_name)) codes.push('reg_mname_fail');
    if (req.middle_name == '') req.middle_name = null;
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.check(req.last_name)) codes.push('reg_lname_fail');
    if (!(req.birth_year < 1900 && (new Date().getFullYear() - req.birth_year > 18)))
        codes.push('reg_byear_fail');
    if (req.gender != 'M' && req.gender != 'F' && req.gender != 'O') codes.push('reg_gender_fail');
    if (req.phone_number == '') req.phone_number = null;
    else if (/^[0-9]{7,15}$/.check(req.phone)) 
        codes.push('reg_phone_fail');
    if (codes.length > 0) {
        res.status(400).send({code: codes});
        return;
    }
    if (hashed.length > 1) {
        req.app.locals.pool.query('CALL register_user(?,?,?,?,?,?,?,?);', [
            req.first_name,
            req.middle_name,
            req.last_name,
            req.birth_year,
            req.gender,
            req.phone_number,
            req.email,
            hashed
        ], (err, results) => {
            if (err) res.status(500).send({code: 'srv_err', loc: 'reg_user'});
        });
    } else res.status(500).end();
    res.status(200).send({code: 'reg_success', sess_id: 'UNIMPLEMENTED'});
});
router.post('/login', (req, res) => {
    // access user info 
});
router.get('/:id', (req, res) => {

})
