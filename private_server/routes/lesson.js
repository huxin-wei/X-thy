const express = require('express')
const router = express.Router()
const {addLesson, getLessons, deleteLesson} = require('./../js/query')

router.get('/test', function(req, res) {
    res.send('respond with a resource');
});

router.get('/', async(req, res) => {
    try{
        let lessons = await getLessons()
        lessons = lessons.filter(lesson => lesson.status !== 'deleted')
        console.log('success')
        res.status(200).json({
            success: true,
            data: lessons
        })
    } catch (error) {
        console.log(error)
        res.status(203).json({
            sucess: false,
            message: 'Something went wrong.'
        })
    }
});

router.post('/', async(req, res) => {
    const data = req.body
    try {
        if(!data.lesson){
            throw 'lesson name is required.'
        }

        await addLesson(data.lesson, data.description, data.price30m, data.price60m)
        res.status(200).json({
        success: true
        })
    } catch(error){
        console.log(error)
        res.status(203).json({
        success: false,
        message: 'Failed to add new lesson'
        })
    }
})

router.delete('/:lessonId', async(req, res) => {
    try {
        const lessonId = parseInt(req.params.lessonId)
        await deleteLesson(lessonId)
        res.status(200).json({
            success: true
        })
    } catch(error){
        console.log(error)
        res.status(203).json({
            success: false,
            message: 'Something went wrong.'
        })
    }
})

module.exports = router