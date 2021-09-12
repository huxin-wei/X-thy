const express = require('express')
const router = express.Router()
const {getUpcomingAppointment, getAppointmentById, getAppointmentBetween} = require('./../js/query')
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

router.get('/week', authenticateJWT, async (req, res) => {
    let utcDateStr = req.query.utcDate
    console.log(utcDateStr)
    if(!utcDateStr){
        return res.status(203).json({
            success: false,
            message: 'Date is required.'
        })
    }

    let date = new Date(utcDateStr)
    date.setHours(0)
    date.setMinutes(0)
    date.setMilliseconds(0)

    if(date == 'Invalid Date'){
        return res.status(203).json({
            success: false,
            message: 'Invalid date input.'
        })
    }

    //set date to beginning of the week and start of the next week
    let beginDate = new Date(date)
    beginDate.setDate(beginDate.getDate() - beginDate.getDay())

    let endDate = new Date(beginDate)
    endDate.setDate(beginDate.getDate() + 7)
    console.log('before try')
    // query appointment between these 2 dates
    try {
        const appointments = await getAppointmentBetween(beginDate, endDate)
        console.log('after async')

        return res.status(200).json({
            success: true,
            appointments: appointments
        })
    } catch (error) {
        console.log(error.message)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request'
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