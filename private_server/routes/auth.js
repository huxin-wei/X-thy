const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {getUser} = require('./../js/query')
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

const generateAccessToken = (user) => {
    return jwt.sign({userId: user.id}, process.env.TOKEN_SECRET)
}

router.post('/login', async(req, res) => {
    let {email, password} = req.body
    
    if (!email || !password){
        return res.status(203).json({
            success: false,
            message: 'Require both email and password.'
        })
    }

    email = email.toLowerCase()

    try{
        let user = await getUser(email)
        if(user.length < 1){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        user = user[0]

        //Compare passwords
        const isMatch = await comparePasswords(password, user.password)

        if(isMatch){
            const token = generateAccessToken(user)

            //set jsonweb token in httpOnly cookie -- set to NEVER expires
            res.cookie('ACCESS_TOKEN', token, {expires: new Date(253402300000000), httpOnly: true})


            return res.status(200).json({
                success: true,
                message: 'Successfully logged in.',
                email: user.email
            })
        }

        throw new Error('Incorrect email or password')
    } catch(error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
})

router.post('/logout', authenticateJWT, (req,res) => {
    try {
        res.clearCookie('ACCESS_TOKEN')
        res.status(201).json({
            success: true
        })
    } catch(error){
        res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot safely logout now. Try later.'
        })
    }
})

module.exports = router