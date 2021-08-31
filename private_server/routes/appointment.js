const express = require('express')
const router = express.Router()
const {getUpcomingAppointment, getAppointmentById} = require('./../js/query')
const authenticateJWT = require('./../js/authenticateJWT')

router.get('/upcoming', authenticateJWT, async (req, res) => {
    let now = new Date(req.query.now)

    try {
        let appointments = await getUpcomingAppointment(now)
        if(!appointments.length){
            return res.status(203).json({
                success: false,
                message: 'There is no upcoming appointment.'
            })
        }

        return res.status(200).json({
            success: true,
            appointments: appointments
        })
    } catch(error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process you request.'
        })
    }
})

router.get('/id/:id', authenticateJWT, async (req, res) => {
    let {id} = req.params
    id = parseInt(id)
    if(!id){
        return res.status(203).json({
            success: false,
            message: 'Appointment ID is missing.'
        })
    }

    try {
        const appointment = await getAppointmentById(id)
        if(!appointment.length){
            return res.status(203).json({
                success: false,
                message: 'Invalid appointment ID.'
            })
        }

        return res.status(200).json({
            success: true,
            appointment: appointment[0]
        })

    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})




module.exports = router