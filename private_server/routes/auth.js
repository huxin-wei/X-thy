const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    refreshForwardEmails,
    getAdminById,
    getAdmin,
    storeAccountSettingCode,
    updateEmailByCode,
    updatePwd,
    updatePwdByCode } = require('./../js/query')
const { generateRandomChars, validateEmail, validatePassword, transport } = require('./../js/miscMethod')
const authenticateJWT = require('./../js/authenticateJWT')
require('dotenv').config()

const comparePasswords = (plainText, encrypted) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, encrypted, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

router.post('/login', async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.status(203).json({
            success: false,
            message: 'Require both email and password.'
        })
    }

    email = email.toLowerCase()

    try {
        let admin = await getAdmin(email)
        if (admin.length < 1) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        admin = admin[0]

        //Compare passwords
        const isMatch = await comparePasswords(password, admin.password)

        if (isMatch) {
            const token = jwt.sign({ userId: admin.user_id }, process.env.TOKEN_SECRET)

            //set jsonweb token in httpOnly cookie -- set to NEVER expires
            res.cookie('ACCESS_TOKEN', token, { expires: new Date(253402300000000), httpOnly: true })

            return res.status(200).json({
                success: true,
                message: 'Successfully logged in.',
                email: admin.email
            })
        }

        throw new Error('Incorrect email or password')
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
})

router.get('/userinfo', authenticateJWT, async (req, res) => {
    const userId = parseInt(req.payload.userId)

    try {
        let admin = await getAdminById(userId)

        if (!admin.length) {
            return res.status(203).json({
                success: false,
                message: 'Does not exist.'
            })
        }

        admin = admin[0]
        return res.status(200).json({
            success: true,
            email: admin.email
        })

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})

const hashPwd = (plainTextPwd) => {
    return new Promise((resolve, reject) => {
        const saltRounds = 10
        bcrypt.hash(plainTextPwd, saltRounds, function (err, hash) {
            if (err) {
                return reject(err)
            }
            resolve(hash)
        });
    })
}

// admin request passcode to reset password
router.post('/requestresetpasswordcode', async (req, res) => {
    const { email } = req.body

    if (!validateEmail(email)) {
        return res.status(203).json({
            success: false,
            message: 'Invalid email.'
        })
    }

    try {
        let admin = await getAdmin(email)
        if (!admin.length) {
            return res.status(203).json({
                success: false,
                message: 'Invalid email.'
            })
        }

        admin = admin[0]

        // generate random code (10 chars) and store in db admin table
        const code = generateRandomChars(10)
        let storeResult = await storeAccountSettingCode(email, code, 'password')

        if (storeResult.affectedRows) {
            // send email
            transport.sendMail({
                from: process.env.ADMIN_GMAIL_ADDRESS,
                to: email,
                subject: `reset password code`,
                html: `
                <p>This is your reset password code. Use this code within 10 minutes.</p>
                <p>code: <b>${code}</b></p>
            `
            })

            return res.status(200).json({
                success: true
            })
        }

        throw new Error()

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})

router.post('/resetpasswordbycode', async (req, res) => {
    const { pwd, pwdConfirm, code } = req.body

    if (!pwd || !pwdConfirm || !code) {
        return res.status(203).json({
            success: false,
            message: 'Require password, password confirm, and reset code.'
        })
    }

    const pwdErrors = validatePassword(pwd)
    if (pwd !== pwdConfirm) {
        pwdErrors.push('Passwords do not match.')
    }

    if (pwdErrors.length) {
        return res.status(203).json({
            success: false,
            message: pwdErrors
        })
    }

    try {
        // hash password then store
        const hashedPwd = await hashPwd(pwd)
        const result = await updatePwdByCode(hashedPwd, code)

        if (result.affectedRows) {
            return res.status(200).json({
                success: true,
                message: 'Reset password code has been sent to the provided email.'
            })
        } else {
            return res.status(203).json({
                success: false,
                message: 'Cannot change your password. The code might be incorrect or expired.'
            })
        }
    } catch (error) {
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})

router.post('/changepassword', authenticateJWT, async (req, res) => {
    const userId = req.payload.userId
    const { currentPwd, newPwd, newPwdConfirm } = req.body

    if (!currentPwd || !newPwd || !newPwdConfirm) {
        return res.status(203).json({
            success: false,
            message: ['Require current password, new password, and new password confirmation.']
        })
    }

    const pwdErrors = validatePassword(newPwd)
    if (newPwd !== newPwdConfirm) {
        pwdErrors.push('Passwords do not match.')
    }

    if (pwdErrors.length) {
        return res.status(203).json({
            success: false,
            message: pwdErrors
        })
    }

    try {
        // get user and compare password
        let admin = await getAdminById(userId)

        if (!admin.length) {
            return res.status(203).json({
                success: false,
                message: ['The user does not exist.']
            })
        }

        admin = admin[0]

        //Compare passwords
        const isMatch = await comparePasswords(currentPwd, admin.password)

        if (isMatch) {
            // hash password then store
            const hashedPwd = await hashPwd(newPwd)
            const result = await updatePwd(hashedPwd, userId)

            if (result.affectedRows) {
                return res.status(200).json({
                    success: true,
                    message: ['Successfully changed your password.']
                })
            } 

            throw new Error()
        } 

        else {
            return res.status(203).json({
                success: false,
                message: ['Current password is incorrect.']
            })
        }

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: ['Something went wrong. Cannot process your request.']
        })
    }
})

router.post('/changeemail/code', authenticateJWT, async (req, res) => {
    let { newEmail, password } = req.body
    const userId = parseInt(req.payload.userId)
    if (!userId || !newEmail || !password) {
        return res.status(203).json({
            success: false,
            message: 'Require new email and password'
        })
    }

    newEmail = newEmail.toLowerCase()

    const isEmail = validateEmail(newEmail)
    if (!isEmail) {
        return res.status(203).json({
            success: false,
            message: 'Invalid email format.'
        })
    }

    try {
        // check if new email is not exist in admin table
        let user = await getAdmin(newEmail)
        if (user.length) {
            return res.status(203).json({
                success: false,
                message: 'The new email already exists.'
            })
        }

        // get user to compare password. If not match, response with success false.
        user = await getAdminById(userId)
        if (!user.length) {
            return res.status(203).json({
                success: false,
                message: 'The user does not exist.'
            })
        }

        user = user[0]

        let passwordMatch = await comparePasswords(password, user.password)

        if (passwordMatch) {
            // generate code and send to the new email to confirm
            const code = generateRandomChars(10)
            let storeResult = await storeAccountSettingCode(userId, code, 'email', newEmail)

            if (storeResult.affectedRows) {
                // send email
                transport.sendMail({
                    from: process.env.ADMIN_GMAIL_ADDRESS,
                    to: newEmail,
                    subject: `Email changing`,
                    html: `
                    <p>Use this code to finalise email changing <br><b>${code}</b></br></p>
                `
                })

                return res.status(200).json({
                    success: true,
                    message: 'Code has been sent to your new email.'
                })
            } else {
                throw new Error()
            }
        } else {
            return res.status(203).json({
                success: false,
                message: 'Inccorrect password.'
            })
        }

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process the request.'
        })
    }
})

router.post('/changeemail/change', async (req, res) => {
    const { code } = req.body

    if (!code) {
        return res.status(203).json({
            success: false,
            message: 'Code is required.'
        })
    }

    try {
        const changeResult = await updateEmailByCode(code)
        if (changeResult.affectedRows) {
            refreshForwardEmails()

            return res.status(201).json({
                success: true,
                message: 'Successfully changed email.',
                result: changeResult
            })
        } else {
            return res.status(203).json({
                success: false,
                message: 'Cannot change email. The code might be incorrect or expired.'
            })
        }

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }

})

router.post('/logout', authenticateJWT, (req, res) => {
    try {
        res.clearCookie('ACCESS_TOKEN')
        res.status(201).json({
            success: true,
            message: 'Logged out. Cookie has been cleared.'
        })
    } catch (error) {
        res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot safely logout now. Try later.'
        })
    }
})

module.exports = router