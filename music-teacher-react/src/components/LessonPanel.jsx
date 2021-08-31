import React, { useState, useEffect, useRef } from 'react'
import CreateLessonForm from './CreateLessonForm'
import Lesson from './Lesson'
import { EatLoading } from 'react-loadingg'

const url = 'http://localhost:3001/api'

function LessonPanel() {
	const [lessons, setLessons] = useState([])
	const [showForm, setShowForm] = useState(false)
	const [addSuccess, setAddSuccess] = useState(false)
	const [dummy, setDummy] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const mountedRef = useRef(true)

	const signalAddSuccess = () => {
		setAddSuccess(true)
		setDummy(dummy + 1)
		setTimeout(() => {
			setAddSuccess(false)
		}, 2000)
	}

	const removeLesson = (lessonId) => {
		setLessons(lessons.filter(lesson => lesson.lesson_id != lessonId))
	}

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!mountedRef.current) return null

		setIsLoading(true)
		setError('')

		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			credentials: 'include'
		}
		fetch(`${url}/lesson/active`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if (!data.success) {
					throw new Error(data.message)
				}
				if (!data.lessons.length) {
					throw new Error('There is no lesson. Please consider creating one.')
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
	}, [dummy])

	return (
		<div className="pt-3">

			{/* {msg when successfully add new lesson} */}
			{
				addSuccess &&
				<div className="alert alert-success" role="alert">
					Successfully added.
				</div>
			}

			{/* {show form when the button clicked} */}
			{
				showForm ?
					<CreateLessonForm handleClose={() => setShowForm(false)} signalAddSuccess={signalAddSuccess} />
					:
					<button className="btn btn-primary" onClick={() => setShowForm(true)}>
						Add
					</button>
			}

			<div className="pt-5 ps-3 pe-3">

				{/* {LOADING && ERROR} */}
				{
					isLoading ? <EatLoading color="orange" />
						: (error &&
							<div className="alert alert-danger" role="alert">
								{error}
							</div>
						)

				}

				{/* {ALL LESSONS} */}
				{
					lessons.map(lesson => {
						return (
							<Lesson
								key={lesson.lesson_id}
								removeLesson={removeLesson}
								lessonId={lesson.lesson_id}
								lessonName={lesson.lesson_name}
								description={lesson.description}
								price30m={lesson.price_30m}
								price60m={lesson.price_60m}
							/>
						)

					})
				}
			</div>
		</div>
	)
}

export default LessonPanel
