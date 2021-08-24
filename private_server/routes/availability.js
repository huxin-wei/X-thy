let express = require('express')
let router = express.Router()
let {addAvailability, getAvailability, getSameDayAppointmnet, getAllAvailability} = require('./../js/query')

const checkTime = (msgList, timeFrom, timeTo) => {
    let from = parseInt(timeFrom)
    let to = parseInt(timeTo)


    if( !(timeFrom === 0 || timeTo === 0) && (!timeFrom || !timeTo)){
        msgList.push('Time is missing.')
        return 
    }

    let duration = to - from
    console.log(`duration: ${duration}`)

    if (duration <= 0){
        msgList.push('Times conflict.')
        return
    }

    if (duration%30 != 0){
        msgList.push('Time is not an increment of 30 minutes.')
    }

    if (from%30 != 0 || to%30 != 0){
        msgList.push('Minute should be 0 or 30.')
    }
}

const checkDay = (msgList, days) => {
    let d = parseInt(days)

    if(d !==0 && (!days || !d)){
        msgList.push('At least one day must be selected')
    }
}

router.get('/', async(req,res) => {
    try{
        const availabilities = await getAllAvailability()
        if(availabilities.length < 1){
            return res.status(203).json({
                success: false,
                message: 'No availability has been set.'
            })
        }

        return res.status(200).json({
            success: true,
            data: availabilities
        })
    } catch(error){
        console.log(error)
        res.status(203).json({
            success: false,
            message: error.message
        })
    }

    return res.status(200).json({
        success: true
    })
})

router.post('/', async(req, res) => {
    const data = req.body
    console.table(data)
    let errors = []

    checkTime(errors, data.timeFrom, data.timeTo)
    let days = data.days
    checkDay(errors, days)

    if (errors.length > 0){
        console.log(errors)
        return res.status(203).json({
            success: false,
            message: errors
        })
    }

    let from = parseInt(data.timeFrom)
    let to = parseInt(data.timeTo)

    // store in database
    try{
        await addAvailability(from, to, days)
        return res.status(200).json({
            success: true
        })

    } catch(error){
        return res.status(203).json({
            success: false,
            message: [error.message]
        })
    } 
})

router.get('/offertime', async(req, res) => {
    let day = req.query.day
    let duration = parseInt(req.query.duration)
    let utcDateStr = req.query.utcDate



    // check inputs
    if ((!day && day != 0) || (!duration) || !utcDateStr){
        return res.status(203).json({
            success: false,
            message: ['Missing some data.']
        })
    }  

    if (duration <= 0){
        return res.status(203).json({
            success: false,
            message: ['Invalid time.']
        })
    }

    let date = new Date(utcDateStr)
    if (!date instanceof Date){
        return res.status(203).json({
            success: false,
            message: ['Invalid date. Require UTC time string']
        })   
    }

    try{
        const avail_results = await getAvailability(day)
        const app_result = await getSameDayAppointmnet(date)
        let offeredTimes = []

        // loop through available time
        avail_results.map(avail => {
            let currentMinute = parseInt(avail.start_minute)
            // loop 8:30 9:00 ... for 30 minutes session
            while(currentMinute + duration <= avail.end_minute){
                let headDT = new Date(date + ' ' + convertTotalMinuteToHHMM(currentMinute))
                let tailDT = new Date(date + ' ' + convertTotalMinuteToHHMM(currentMinute + duration))
                let isFree = true

                for(let i = 0; i < app_result.length - 1; i++){
                    // console.log(app_result[i].appointment_start)
                    // console.log(app_result[i].appointment_end)
                    let appStart = new Date(app_result[i].appointment_start)
                    let appEnd = new Date(app_result[i].appointment_end)

                    if( (headDT < appStart && tailDT > appStart) || (headDT < appEnd && tailDT > appEnd) || (headDT >= appStart && tailDT <= appEnd)){
                        isFree = false
                        break
                    }
                }
                if(isFree){
                    offeredTimes.push(currentMinute)
                }
                currentMinute += duration
            }
        })

        offeredTimes = [...new Set(offeredTimes)]
        offeredTimes.sort((a, b) => a - b)

        return res.status(200).json({
            success: true,
            result: avail_results,
            date: app_result,
            times: offeredTimes
        })

    }catch(error){
        console.log(error.message)
        return res.status(203).json({
            success: false,
            message: [error.message]
        })

    }
})

const convertTotalMinuteToHHMM = (totalMinute) => {
    return Math.floor(totalMinute/60) + ':' + totalMinute%60 
}

module.exports = router