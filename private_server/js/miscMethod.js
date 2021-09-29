const nodemailer = require('nodemailer')

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateIfNotPast(baseDatetime) {
    return Date.parse(baseDatetime) > Date.parse(new Date())
}

function generateRandomChars(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADMIN_GMAIL_ADDRESS,
        pass: process.env.ADMIN_GMAIL_PASSWORD,
    },
});

const validatePassword = (password) => {
    const pwdError = []
    if (password.length < 8) {
        pwdError.push('Password length must be atleast 8 characters.')
    } else if (password.length > 20) {
        pwdError.push('Password length must not exceed 20 characters.')
    }

    let re = /(?=.*[a-z])/
    if (!re.test(password)) {
        pwdError.push('Password must contain atleast 1 lowercase alphabetical character')
    }

    re = /(?=.*[A-Z])/
    if (!re.test(password)) {
        pwdError.push('Password must contain at least 1 uppercase alphabetical character')
    }

    re = /(?=.*[0-9])/
    if (!re.test(password)) {
        pwdError.push('Password must contain at least 1 numeric character')
    }

    return pwdError

}

module.exports = {
    validateEmail,
    validateIfNotPast,
    generateRandomChars,
    validatePassword,
    transport
}