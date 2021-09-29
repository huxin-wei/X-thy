const express = require('express')
const router = express.Router()
const { getForwardEmails, getLesson, bookAppointment } = require('../js/query')
const { validateEmail, validateIfNotPast, generateRandomChars, transport } = require('../js/miscMethod.js')
const Intl = require('intl')
require('dotenv').config()

function lessonFinishBeforeMidnight(datetime, duration) {
    let hour = datetime.getHours()
    let minute = datetime.getMinutes()
    let totalMinute = Math.floor(hour * 60) + minute + duration
    return totalMinute <= 24 * 60
}

function createCancelCode() {
    let d = new Date
    let code = d.getTime() + '$'
    return code + generateRandomChars(10)
}

// Book an appointment
router.post('/', async (req, res) => {
    let { name, email, phone, note, date, duration, lessonId } = req.body
    let startDatetime = new Date(date)
    duration = parseInt(duration)

    const errors = [
        ...(name && name.length <= 50 ? [] : ['Valid name is missing.']),
        ...(validateEmail(email) && email.length <= 50 ? [] : ['Valid email is missing.']),
        ...(!phone || phone.length <= 20 ? [] : ['Phone number is too long.']),
        ...(!note || note.length <= 255 ? [] : ['Note must not exceed 255 character']),
        ...(validateIfNotPast(startDatetime) ? [] : ['The time already past.']),
        ...(duration && duration > 0 && duration % 30 == 0 ? [] : ['Invalid duration.']),
        ...(lessonId ? [] : ['Invalid lesson ID'])
    ]

    if (errors.length) {
        return res.status(203).json({
            success: false,
            message: errors
        })
    }

    if (!lessonFinishBeforeMidnight) {
        return res.status(203).json({
            success: false,
            message: 'Lesson does not finish in a day.'
        })
    }

    let lesson
    try {
        lesson = await getLesson(lessonId)
        if (lesson.length < 1) {
            return res.status(203).json({
                success: false,
                message: `The lesson with ID: ${lessonId} does not exist. It might be removed by admin.`
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Someting went wrong. Cannot process you booking.'
        })
    }

    lesson = lesson[0]
    const fee = lesson.price_60m * Math.floor(duration / 60) + lesson.price_30m * (duration % 60 == 30 ? 1 : 0)
    let cancelCode = createCancelCode()
    let endDatetime = new Date(startDatetime)
    endDatetime.setMinutes(endDatetime.getMinutes() + duration)
    let startMinute = startDatetime.getHours() * 60 + startDatetime.getMinutes()
    let endMinute = startMinute + duration
    let dayOfWeek = startDatetime.getDay()


    try {
        const bookingResult = await bookAppointment(new Date(), name, email, phone, note, startDatetime,
            endDatetime, duration, lesson.lesson_id, fee, cancelCode, startMinute, endMinute, dayOfWeek)

        console.log(startDatetime)
        if (bookingResult.affectedRows < 1) {
            return res.status(203).json({
                success: false,
                message: 'Sorry, I am not available at that time. Please choose a new one.'
            })
        }

        // as the server use UTC time - convert time using toLocaleString() with timezone parameter
        //new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: "Australia/Sydney" }).format(date))
        // let convertedTime = new Intl.DateTimeFormat('en-AU', { dateStyle: 'full', timeStyle: 'long', timeZone: "Australia/Brisbane" }).format(startDatetime)

        // toLocaleString Method
        console.log(`toLocaleString ${startDatetime.toLocaleString('en-AU', { timeZone: "Australia/Brisbane" })}`)

        const forwardEmails = getForwardEmails()
        transport.sendMail({
            from: process.env.ADMIN_GMAIL_ADDRESS,
            to: email,
            bcc: forwardEmails,
            subject: `Successfully booked for ${lesson.lesson_name} at ${startDatetime.toLocaleString('en-AU', { timeZone: "Australia/Brisbane" })}`,
            html: `<div>
            <h1>Successfully booked for ${lesson.lesson_name}</h1>
            <p>HEY Time should be correct</p>
            <p>Thank you for booking. I am looking forward to seeing you in the class.</p>
            <p>Here is your appointment information</p>
            <table>
                <tr>
                    <td><b>Test to locale: </b>${startDatetime.toLocaleString('en-AU', { timeZone: "Australia/Brisbane" })}</td>
                </tr>
                <tr>
                    <td><b>Name: </b>${name}</td>
                </tr>
                <tr>
                    <td><b>Datetime: </b>${startDatetime.toLocaleString('en-AU', { timeZone: "Australia/Brisbane" })}</td>
                </tr>
                <tr>
                    <td><b>Duration: </b>${duration} minutes</td>
                </tr>
                <tr>
                    <td><b>Class: </b>${lesson.lesson_name}</td>
                </tr>
                <tr>
                    <td><b>Class ID: </b>${lesson.lesson_id}</td>
                </tr>
                <tr>
                    <td><b>Fee: </b>$${fee}</td>
                </tr>
                <tr>
                    <td><b>Booking reference number: </b>${bookingResult.insertId}</td>
                </tr>
            </table>
            <p>To cancel the appointment <a href=${process.env.SERVER_URL}/api/appointment/usercancel?id=${bookingResult.insertId}&cancelCode=${cancelCode}> Click here</a></p>
            </div>`
        })

        // const allApp = await getAllAppointments()
        return res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your booking.'
        })
    }
})

module.exports = router