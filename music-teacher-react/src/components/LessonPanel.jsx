import React, { useState, useEffect } from 'react'
import CreateLessonForm from './CreateLessonForm'
import Lesson from './Lesson'

const url = 'http://localhost:3001'

function LessonPanel() {
    const [lessons, setLessons] = useState([])
    const [num, setNum] = useState(0)

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        fetch(`${url}/lesson`, requestOptions)
            .then(res => res.json())
            .then(res => {
                let data = res.data
                console.log('data is:', data)
                setLessons(data)
            })
            .catch(err => {
                console.log(err)
                // setLessons([])
            })
    }, [num])

    return (
        <div className="pt-3">
            <CreateLessonForm />
            <div className="pt-5 ps-3 pe-3">
                {
                    lessons.map(lesson => {
                        return (
                            <Lesson 
                                key={lesson.lesson_id}
                                lessonName = {lesson.lesson_name} 
                                description = {lesson.description}
                                price30m = {lesson.price_30m}
                                price60m = {lesson.price_60m}
                            />
                        )

                    })
                }
            </div>
        </div>
    )
}

export default LessonPanel
