import React, { useState, useEffect, useRef } from 'react'
import { EatLoading } from 'react-loadingg'
import { API_URL } from '../JS/variables';

function ClassOffer(props) {
    const [lessons, setLessons] = useState([])
    const [selectedLessonId, setSelectedLessonId] = useState(null)
    const mountedRef = useRef(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!mountedRef.current) return null

        setIsLoading(true)
        setError('')

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        fetch(`${API_URL}/api/lesson/active`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(data.message)
                }
                if (!data.lessons.length) {
                    throw new Error('We are sorry. No lesson is available now.')
                }
                if (!mountedRef.current) return null
                setLessons(data.lessons)
                setIsLoading(false)
                setError('')
            })
            .catch(error => {
                if (!mountedRef.current) return null
                console.log(error.message)
                setIsLoading(false)
                setError(error.message)
            })

        return () => {
            mountedRef.current = false
        }
    }, [])

    return (
        <div>
            {/* {LOADING && ERROR} */}
            {
                isLoading ? <EatLoading color="orange" />
                    : (error &&
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )

            }
            <div className="class-offer-flex">
            {lessons.map(lesson => {

                return (
                    <div className={`class-offer my-2 ${selectedLessonId == lesson.lesson_id? "class-offer-active" : "class-offer-inactive"}`}  
                    key={lesson.lesson_id} 
                    onClick={() => {
                        setSelectedLessonId(lesson.lesson_id)
                        props.selectLesson({
                            lessonId: lesson.lesson_id,
                            lessonName: lesson.lesson_name,
                            price30m: lesson.price_30m,
                            price60m: lesson.price_60m,
                        })
                    }}>
                        <h3>{lesson.lesson_name}</h3>
                        <p>30 minutes: ${lesson.price_30m}</p>
                        <p>60 minutes: ${lesson.price_60m}</p>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default ClassOffer
