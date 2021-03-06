let express = require('express')
let router = express.Router()
let { addAvailability,
    getAvailability,
    getSameDayAppointmnet,
    getAllAvailability,
    deleteAvailability } = require('./../js/query')
const authenticateJWT = require('./../js/authenticateJWT')

const checkTime = (msgList, timeFrom, timeTo) => {
    let from = parseInt(timeFrom)
    let to = parseInt(timeTo)


    if (!(timeFrom === 0 || timeTo === 0) && (!timeFrom || !timeTo)) {
        msgList.push('Time is missing.')
        return
    }

    let duration = to - from

    if (duration <= 0) {
        msgList.push('Times conflict.')
        return
    }

    if (duration % 30 != 0) {
        msgList.push('Time is not an increment of 30 minutes.')
    }

    if (from % 30 != 0 || to % 30 != 0) {
        msgList.push('Minute should be 0 or 30.')
    }
}

const checkDay = (msgList, days) => {
    let d = parseInt(days)

    if (d !== 0 && (!days || !d)) {
        msgList.push('At least one day must be selected')
    }
}

router.get('/all', async (req, res) => {
    try {
        const availabilities = await getAllAvailability()
        if (availabilities.length < 1) {
            return res.status(203).json({
                success: false,
                message: 'No availability has been set.'
            })
        }

        return res.status(200).json({
            success: true,
            data: availabilities
        })

    } catch (error) {
        res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot get availability list.'
        })
    }
})

// Add availability
router.post('/', authenticateJWT, async (req, res) => {
    const data = req.body
    let errors = []

    checkTime(errors, data.timeFrom, data.timeTo)
    let days = data.days
    checkDay(errors, days)

    if (errors.length > 0) {
        return res.status(203).json({
            success: false,
            message: errors
        })
    }

    let from = parseInt(data.timeFrom)
    let to = parseInt(data.timeTo)

    // store in database
    try {
        await addAvailability(from, to, days)
        return res.status(200).json({
            success: true
        })

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: [error.message]
        })
    }
})

router.get('/offertime', async (req, res) => {
    let day = req.query.day
    let duration = parseInt(req.query.duration)
    let utcDateStr = req.query.utcDate

    // check inputs
    if ((!day && day != 0) || (!duration) || !utcDateStr) {
        return res.status(203).json({
            success: false,
            message: ['Missing some data.']
        })
    }

    if (duration <= 0) {
        return res.status(203).json({
            success: false,
            message: ['Invalid time.']
        })
    }

    let date = new Date(utcDateStr)

    if (!date instanceof Date) {
        return res.status(203).json({
            success: false,
            message: ['Invalid date. Require UTC time string']
        })
    }
    let counter = 0
    try {
        const avail_results = await getAvailability(day)
        const appt_result = await getSameDayAppointmnet(date)
        let offeredTimes = new Set()
        const now = new Date()

        // loop through available time
        avail_results.map(avail => {
            let currentMinute = parseInt(avail.start_minute)

            while (currentMinute + duration <= avail.end_minute) {
                //let headDT = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + convertTotalMinuteToHHMM(currentMinute))
                let headDT = new Date(date)
                headDT.setMinutes(headDT.getMinutes() + currentMinute)

                let tailDT = new Date(date)
                tailDT.setMinutes(tailDT.getMinutes() + currentMinute + duration)

                //let tailDT = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + convertTotalMinuteToHHMM(currentMinute + duration))
                let isFree = true

                if (headDT < now) {
                    currentMinute += 30
                    continue // already past
                }

                for (let i = 0; i < appt_result.length; i++) {
                    let appointment_start = new Date(appt_result[i].appointment_start)
                    let appointment_end = new Date(appt_result[i].appointment_end)

                    if ((headDT <= appointment_start && tailDT > appointment_start) ||
                        (headDT >= appointment_start && headDT < appointment_end)) {
                        isFree = false
                        break
                    }
                }
                if (isFree) {
                    offeredTimes.add(headDT.toUTCString())
                }
                currentMinute += 30
            }
        })

        offeredTimes = Array.from(offeredTimes)
        offeredTimes.sort((a, b) => new Date(a) - new Date(b))

        return res.status(200).json({
            success: true,
            times: offeredTimes
        })

    } catch (error) {
        return res.status(203).json({
            success: false,
            message: [error.message]
        })

    }
})

// Delete availability
router.delete('/delete/:availabilityId', authenticateJWT, async (req, res) => {
    //need middle ware for authentication

    const availabilityId = parseInt(req.params.availabilityId)
    if (!availabilityId) {
        return res.status(203).json({
            success: false,
            message: 'Invalid availability ID.'
        })
    }

    try {
        const deleteResult = await deleteAvailability(availabilityId)
        if (!deleteResult.affectedRows) {
            return res.status(203).json({
                success: false,
                message: 'No such id.'
            })
        }

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request.'
        })
    }
})



const convertTotalMinuteToHHMM = (totalMinute) => {
    return Math.floor(totalMinute / 60) + ':' + totalMinute % 60
}

module.exports = router