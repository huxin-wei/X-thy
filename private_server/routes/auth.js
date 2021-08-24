const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {getUser} = require('./../js/query')
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
    console.log(req.body)
    console.log(email)
    console.log(password)
    
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
        console.log()
        if(isMatch){
            const token = generateAccessToken(user)

            //set jsonweb token in cookie -- set to NEVER expires
            res.cookie('ACCESS_TOKEN', token, {expires: new Date(253402300000000)})

            return res.status(200).json({
                success: true,
                message: 'Successfully logged in.'
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

// a middle ware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    try{
        const token = req.cookies.ACCESS_TOKEN
        if(!token){
            throw new Error('Unauthorized!')
        }
        const payload = jwt.verify(token, process.env.TOKEN_SECRET)
        req.payload = payload
        next()
    } catch(error){
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = router