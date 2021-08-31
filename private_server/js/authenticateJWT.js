const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
    try {
        const token = req.cookies.ACCESS_TOKEN
        const payload = jwt.verify(token, process.env.TOKEN_SECRET)
        req.payload = payload
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: 'Unauthorized.'
        })
    }
}

module.exports = authenticateJWT