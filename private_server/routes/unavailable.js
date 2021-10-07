const express = require('express')
const router = express.Router()
const { bookAppointment} = require('../js/query')
const authenticateJWT = require('../js/authenticateJWT')
let { resolve } = require("path")

router.get('/',authenticateJWT, (req, res) => {
    let absolutePath = resolve('./html/schedule.html')//select unavailable time from available time blocks
    res.sendFile(absolutePath)
    
  })
router.post('/set/',authenticateJWT,async(req,res)=>{
    let {date,duration} =req.body
    console.log(date)
    console.log(duration)
    let startDatetime=new Date(date)
    duration=parseInt(duration)
    let endDatetime = new Date(startDatetime)
        endDatetime.setMinutes(endDatetime.getMinutes() + duration)
    let startMinute = startDatetime.getHours() * 60 + startDatetime.getMinutes()
    let endMinute = startMinute + duration
    let dayOfWeek = startDatetime.getDay()
    console.log(startMinute)
    
    try {
        const bookingResult = await bookAppointment(new Date(),"self", '', '', 'busy', startDatetime,
            endDatetime, duration, 0, 0, 0, startMinute, endMinute, dayOfWeek)
        console.log(bookingResult)
        if (bookingResult.affectedRows < 1) {
            return res.status(203).json({
                success: false,
                message: 'Sorry,selected time block is booked.'
            })
        
        }
        return res.status(200).json({
            success: true
        })
    }catch(error){
        console.error();
        return res.status(203).json({
            success:false,
            message:'error'
        })
      }
    })
    module.exports = router