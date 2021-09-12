import React, { useState, useEffect, useRef } from 'react'
import Calendar from './Calendar'
import { API_URL } from '../JS/variables';

function Appointment({ id, time, duration, name, mode }) {
	const [isToggled, setIsToggled] = useState(false)
	const [appointment, setAppointment] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const mountedRef = useRef(true)

	useEffect(() => {

		return () => {
			mountedRef.current = false
		}
	}, [])

	const minutesToHhMmAPmString = (minutes) => {
		let hours = Math.floor(minutes / 60)
		const suffix = hours >= 12 ? "PM" : "AM"
		let minutePart = ((minutes % 60) + '0').substring(0, 2)
		hours = `${((hours + 11) % 12 + 1)}:${minutePart} ${suffix}`
		return hours
	}

	const convertDateAndTimeRangeString = (date, duration) => {
		let d = date.getDate()
		let m = date.getMonth() + 1
		let y = date.getFullYear()
		let start_time_string = minutesToHhMmAPmString(Math.floor(date.getHours()) * 60 + date.getMinutes())
		let end_time_string = minutesToHhMmAPmString(Math.floor(date.getHours()) * 60 + date.getMinutes() + duration)

		return `${d}/${m}/${y} ${start_time_string} - ${end_time_string}`
	}

	const headClicked = () => {
		setIsToggled(!isToggled)
		if (appointment) {
			return // data has already been set
		}

		console.log('I will not load again')

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

		fetch(`${API_URL}/api/appointment/id/${id}`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if (!mountedRef.current) return null
				if (!data.success) {
					throw new Error(data.message)
				}
				setIsLoading(false)
				setError('')
				setAppointment(data.appointment)
			})
			.catch(error => {
				if (!mountedRef.current) return null
				console.log(error)
				setIsLoading(false)
				setError(error.message)
			})
	}

	return (
		<div className="mb-2">
			<div className="appointment-head appointment-head-upcoming" onClick={(e) => headClicked(e)}>
				<b>{convertDateAndTimeRangeString(time, duration)}</b> - {name}
			</div>
			{
				isToggled &&
				<div className="appointment-info-upcoming-wrapper py-2 px-2">
					{/* {LOADING && ERROR} */}
					{
						isLoading  ? <div class="text-center">
							<div class="spinner-border" role="status">
							</div>
						</div>
							: (error &&
								<div className="alert alert-danger" role="alert">
									{error}
								</div>
							)
					}
					{
						appointment &&
						<div>
							<p><b>Datetime: </b>{convertDateAndTimeRangeString(new Date(appointment.appointment_start), appointment.duration)} ({duration} minutes)</p>
							<p><b>Appointment ID: </b>{appointment.appointment_id}</p>
							<p><b>Lesson: </b>{appointment.lesson_name}</p>
							<p><b>Customer: </b>{appointment.customer_name}</p>
							<p><b>Email: </b>{appointment.customer_email}</p>
							<p><b>Phone: </b>{appointment.customer_phone}</p>
							<p><b>Note: </b>{appointment.note}</p>
							<p><b>Fee: </b>${appointment.fee}</p>
						</div>
					}
				</div>
			}

		</div>
	)
}

export default Appointment
