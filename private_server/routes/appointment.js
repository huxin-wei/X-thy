const express = require('express')
const router = express.Router()
const {
    getUpcomingAppointment,
    getAppointmentById,
    getAppointmentBetween,
    cancelAppointmentByCode,
    cancelAppointmentById,
    getForwardEmails } = require('./../js/query')
const { transport } = require('../js/miscMethod.js')
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
    if (!utcDateStr) {
        return res.status(203).json({
            success: false,
            message: 'Date is required.'
        })
    }

    let date = new Date(utcDateStr)

    if (date == 'Invalid Date') {
        return res.status(203).json({
            success: false,
            message: 'Invalid date input.'
        })
    }

    // week begin at day A and end at day A in the next 7 days (7 days)
    let beginDate = new Date(date)
    let endDate = new Date(beginDate)
    endDate.setDate(beginDate.getDate() + 7)

    try {
        const appointments = await getAppointmentBetween(beginDate, endDate, 'active')

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

        if (queryResult.affectedRows) {
            // get user's email from that appointment by apppointment id
            // to send notification email to the user
            let appt = await getAppointmentById(id)
            appt = appt[0]
            const forwardEmails = getForwardEmails()

            let convertedTime = new Intl.DateTimeFormat('en-AU', { dateStyle: 'full', timeStyle: 'long', timeZone: "Australia/Brisbane" }).format(appt.appointment_start)

            transport.sendMail({
                from: process.env.ADMIN_GMAIL_ADDRESS,
                to: appt.customer_email,
                bcc: forwardEmails,
                subject: `Successfully cancelled appointment on ${convertedTime}`,
                html: `<h1>Appointment on ${apptStart} has been successfully cancelled.</h1>
                    <p><b>Class: </b>${appt.lesson_name}</p>
                    <p><b>Duration: </b>${appt.lesson_name}</p>
                    <p><b>Booking reference number: </b>${appt.appointment_id}</p>
                `
            })

            // send delete success page

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

        if (queryResult.affectedRows) {
            // get user's email from that appointment by apppointment id
            // to send notification email to the user
            let appt = await getAppointmentById(id)
            appt = appt[0]
            const forwardEmails = getForwardEmails()
            let convertedTime = new Intl.DateTimeFormat('en-AU', { dateStyle: 'full', timeStyle: 'long', timeZone: "Australia/Brisbane" }).format(appt.appointment_start)
            
            transport.sendMail({
                from: process.env.ADMIN_GMAIL_ADDRESS,
                to: appt.customer_email,
                bcc: forwardEmails,
                subject: `Admin cancelled appointment on ${convertedTime}`,
                html: `<h3>Appointment on ${convertedTime} has been cancelled by admin.</h3>
                    <h4><b>Note: </b>${message}</h4>
                    <p><b>Class: </b>${appt.lesson_name}</p>
                    <p><b>Duration: </b>${appt.lesson_name}</p>
                    <p><b>Booking reference number: </b>${appt.appointment_id}</p>
                `
            })
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