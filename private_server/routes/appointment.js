const express = require('express')
const router = express.Router()
const { 
    getUpcomingAppointment,
    getAppointmentById,
    getAppointmentBetween,
    cancelAppointmentByCode,
    cancelAppointmentById } = require('./../js/query')
const authenticateJWT = require('./../js/authenticateJWT')

router.get('/upcoming', authenticateJWT, async (req, res) => {
    let now = new Date(req.query.now)

    try {
        let appointments = await getUpcomingAppointment(now)
        if (!appointments.length) {
            return res.status(203).json({
                success: false,
                message: 'There is no upcoming appointment.'
            })
        }

        return res.status(200).json({
            success: true,
            appointments: appointments
        })
    } catch (error) {
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
    if (!utcDateStr) {
        return res.status(203).json({
            success: false,
            message: 'Date is required.'
        })
    }

    let date = new Date(utcDateStr)
    console.log(`date after turning from utcstr to date: ${date}`)

    if (date == 'Invalid Date') {
        return res.status(203).json({
            success: false,
            message: 'Invalid date input.'
        })
    }

    //set date to beginning of the week and start of the next week
    let beginDate = new Date(date)
    console.log(`begin date is: ${beginDate}`)
    beginDate.setDate(beginDate.getDate() - beginDate.getDay())

    let endDate = new Date(beginDate)
    endDate.setDate(beginDate.getDate() + 7)

    console.log(`end date is: ${endDate}`)

    try {
        const appointments = await getAppointmentBetween(beginDate, endDate, 'active')

        appointments.forEach(appt => {
            console.log(appt)
        })

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
    console.log('visit app/id')
    let { id } = req.params
    id = parseInt(id)
    if (!id) {
        return res.status(203).json({
            success: false,
            message: 'Appointment ID is missing.'
        })
    }

    try {
        const appointment = await getAppointmentById(id)
        if (!appointment.length) {
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

router.get('/usercancel', async (req, res) => {
    let { id, cancelCode } = req.query
    id = parseInt(id)
    if (!id || !cancelCode) {
        return res.status(203).json({
            success: false,
            message: 'Require both appointment ID and cancel code.'
        })
    }

    try {
        const queryResult = await cancelAppointmentByCode(id, cancelCode)
        console.log(queryResult)

        if(queryResult.affectedRows){
            // send delete success page
            // send email??
            
            return res.status(200).json({
                success: true
            })
        } else {
            // send delete failed page
            return res.status(203).json({
                success: false
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})

router.post('/admincancel', authenticateJWT, async (req, res) => {
    let { id, message } = req.body
    id = parseInt(id)

    if (!id) {
        return res.status(203).json({
            success: false,
            message: 'Require appointment ID.'
        })
    }

    try {
        const queryResult = await cancelAppointmentById(id)

        if(queryResult.affectedRows){
            // send delete success page
            // send email to the customer


            
            return res.status(200).json({
                success: true
            })
        } else {
            // send delete failed page
            return res.status(203).json({
                success: false
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})

module.exports = router