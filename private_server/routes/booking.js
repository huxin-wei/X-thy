const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { getLesson, bookAppointment, getAllAppointments } = require('../js/query')
require('dotenv').config()

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateIfNotPast(baseDatetime) {
    return Date.parse(baseDatetime) > Date.parse(new Date())
}

function lessonFinishBeforeMidnight(datetime, duration) {
    let hour = datetime.getHours()
    let minute = datetime.getMinutes()
    let totalMinute = Math.floor(hour * 60) + minute + duration
    return totalMinute <= 24 * 60
}

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function createCancelCode() {
    let code = ''
    const codeLength = 50
    let d = new Date
    code = d.getTime() + '$'
    return code + makeid(codeLength - code.length)
}

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADMIN_GMAIL_ADDRESS,
        pass: process.env.ADMIN_GMAIL_PASSWORD,
    },
});

// Book an appointment
router.post('/', async (req, res) => {
    let { name, email, phone, note, date, duration, lessonId } = req.body
    console.log('received date', date)
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
                message: `The lesson with ID: ${lessonId} does not exist. It might be deleted by admin.`
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
    console.log('startMinute:', startMinute)
    console.log('endMinute:', endMinute)
    console.log('dayOfWeek:', dayOfWeek)


    try {
        const bookingResult = await bookAppointment(new Date(), name, email, phone, note, startDatetime,
            endDatetime, duration, lesson.lesson_id, fee, cancelCode, startMinute, endMinute, dayOfWeek)

        if (bookingResult.affectedRows < 1) {
            return res.status(203).json({
                success: false,
                message: 'Sorry, I am not available at that time. Please choose a new one.'
            })
        }
        // <h2>Hello ${firstname} ${lastname}</h2>
        await transport.sendMail({
            from: process.env.ADMIN_GMAIL_ADDRESS,
            to: email,
            subject: `Successfully booked for ${lesson.lesson_name} at ${startDatetime.toString()}`,
            html: `<div>
            <h1>Successfully booked for ${lesson.lesson_name}</h1>
            <p>Thank you for booking. I am looking forward to seeing you in the class.</p>
            <p>Here is your appointment information</p>
            <table>
                <tr>
                    <td><b>Name: </b>${name}</td>
                </tr>
                <tr>
                    <td><b>Datetime: </b>${startDatetime.toString()}</td>
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
            <p>Click this link if you want to cancel the appointment.</p>
            <a href=${process.env.URL}/api/booking/cancel?id=${bookingResult.affectedRows}&cancelCode=${cancelCode}> Click here</a>
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
            message: 'Something went wrong. Cannot process your bookie'
        })
    }
})

// name: name,
// email: email,
// phone: phone,
// note: note,
// date: utcTimeStr,
// duration: duration,
// lessonId: lesson.lessonId

module.exports = router