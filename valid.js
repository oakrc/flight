module.exports = {
    // returns if uuid is a valid UUID
    uuid: (uuid) => {
        return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-5][0-9A-F]{3}-[089AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid)
    },

    // returns session UID else sends HTTP 401 and returns ''
    uid: (req, res, next) => {
        const uid = req.session.uid
        if (uid == null) {
            req.session.destroy()
            res.status(401).send({code: 'No session ID found'})
        }
        else if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-5][0-9A-F]{3}-[089AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uid)) {
            res.status(400).send({code: 'Invalid UID'})
        }
        else next()
    },

    // returns a list of reasons why this password shouldn't be accepted
    password: (pwd) => {
        let reasons = []
        if (!/^[a-zA-Z0-9!@#$%^&*()_+-=/.,']{8,}$/.test(pwd)) reasons.push('Illegal characters.');
        if (pwd.replace(/[^A-Z]/g, "").length < 1) reasons.push('Include 1 or more upper-case letters.')
        if (pwd.replace(/[^a-z]/g, "").length < 1) reasons.push('Include 1 or more lower-case letters.')
        if (pwd.replace(/[^0-9]/g, "").length < 1) reasons.push('Include 1 or more numerals.')
      //if (pwd.replace(/[^#$%^&*()_+-=/.,']/g, "").length < 1) reasons.push('Include 1 or more special characters');
        return reasons
    },

    // returns whether email is a valid email
    email: (email) => {
        return /^(([^<>()\[\].,:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(email)
    },

    // check whether the word is a valid first or last name
    first_last: (name) => {
        return /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(name)
    },

    phone_number: (num) => {
        return /^\d{7,15}$/.test(num)
    },

    gender: (gender) => {
        return (gender === 'M' || gender === 'F' || gender === 'O' || gender === 'P')
    },

    postal: (code) => {
        return /^\d{5}$/.test(code)
    }
}
