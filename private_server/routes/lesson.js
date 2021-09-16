const express = require('express')
const router = express.Router()
const { addLesson, getLessons, deleteLesson } = require('./../js/query')
const authenticateJWT = require('./../js/authenticateJWT')

// Get all active lessons
router.get('/active', async (req, res) => {
    try {
        let lessons = await getLessons()
        lessons = lessons.filter(lesson => lesson.status == 'active')
        return res.status(200).json({
            success: true,
            lessons: lessons
        })
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            sucess: false,
            message: 'Something went wrong. Cannot get the list of active lessons now.'
        })
    }
});

// Add lesson
router.post('/add', authenticateJWT, async (req, res) => {
    // add authentication later

    let {lesson, description, price30m, price60m} = req.body

    if (!lesson) {
        return res.status(203).json({
            success: false,
            message: 'Lesson name is required.'
        })
    }

    try {
        await addLesson(lesson, description, price30m, price60m)
        return res.status(200).json({
            success: true,
            message: 'Successfully added.'
        })
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request now.'
        })
    }
})

// Delete lesson
router.delete('/delete/:lessonId', authenticateJWT, async (req, res) => {
    //need middle ware for authentication

    const lessonId = parseInt(req.params.lessonId)
    if(!lessonId){
        return res.status(203).json({
            success: false,
            message: 'Invalid lesson ID.'
        })
    }

    try {
        await deleteLesson(lessonId)
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(203).json({
            success: false,
            message: 'Something went wrong. Cannot process your request now.'
        })
    }
})

module.exports = router