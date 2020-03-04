"use strict"
const express = require('express')
const query = require('../query')
const valid = require('../valid')
const multer = require('multer')
const sg = require('@sendgrid/mail')
sg.setApiKey(process.env.SG_API_KEY)
var upload = multer({
    dest: 'resumes/',
    fileFilter: (req, file, cb) => {
        cb(null, /^.*\.(doc(x)?|png|jpg|jpeg|pdf|txt|rtf|odt)$/.test(file.filename))
    }
})
var router = express.Router()

router.post('/', upload.single('resume'), (req, res, next) => {
    var fname = req.body.first_name,
        lname = req.body.last_name,
        dob = new Date(req.body.birthday),
        phone = req.body.phone_number,
        email = req.body.email,
        jid = req.body.jid
    var age = Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Missing resume file.');
    }

    if (!(valid.first_last(fname)
        && valid.first_last(lname)
        && age >= 18
        && valid.phone_number(phone)
        && valid.email(email))) {

        if (send_mail(fname,lname,age,email,phone,jid,req.file)) {
            res.status(200).json({msg: 'Successfully submitted application.'})
        }
        else {
            res.status(500).json({error: 'Internal Server Error. Please try again later.'})
        }
    }
    else res.status(400).json({error: 'Invalid request.'});
})

function send_mail(fname, lname, age, email, phone, jid, file) {
    var jobs = [
        'Sr. Software Engineer (IT)',
        'Aircraft Support Mechanic (Cabin - Dept #5)',
        'Aircraft Maintenance Technician (Line - Dept #32)',
        'Sr. Repair Coordinator (Repair - Dept #2)',
        'Director (Global Corporate Sales)',
        'Principal Engineer (Engineering)',
        'Team Leader (Global Assistance)',
        'Pre-flight Inspector (Dept #9)',
        'Sr. Analyst (Inventory)',
        'Customer Service Agent (Customer Service)'
    ]
    var msg = null
    msg = {
            from: process.env.MAIL_USER,
            to: 'workat@westflightairlines.com',
            subject: 'Application: ' + jobs[jid]
            + ': ' + lname + ', ' + fname
            + ' | ' + age,
            text: 'Name: ' + lname + ', ' + fname + '\n'
            + 'Applying for: ' + jobs[jid] + '\n'
            + 'Email: ' + email + '\n'
            + 'Phone: ' + phone + '\n'
        + 'Age: ' + age + '\n',
    }
    if (file != null) {
        msg.attachments = [{
            filename: file.originalname,
            content: file.buffer,
            disposition: 'attachment',
            contentId: 'resume'
        }]
    }
    sg.send(msg).then(()=>{},()=>{console.log('ERR: The job application was not sent.')})
    return true
}

module.exports = router
