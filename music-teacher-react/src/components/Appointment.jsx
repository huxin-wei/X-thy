import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables';

function Appointment({ id, onUpdate }) {
	const [appointment, setAppointment] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [showForm, setShowForm] = useState(false)
	const [cancelText, setCancelText] = useState('')
	const [cancelLoading, setCancelLoading] = useState(false)
	const [cancelError, setCancelError] = useState('')
	const mountedRef = useRef(true)

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!id) {
			console.log('id is null')
			setAppointment(null)
			return
		}

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
		console.log('id is: ', id)

		fetch(`${API_URL}/api/appointment/id/${id}`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if (!mountedRef.current) return null
				if (!data.success) {
					throw new Error(data.message)
				}
				setIsLoading(false)
				setError('')
				console.log(data.appointment)
				setAppointment(data.appointment)
			})
			.catch(error => {
				if (!mountedRef.current) return null
				console.log(error)
				setIsLoading(false)
				setError(error.message)
			})
	}, [id])

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

	const onCancelTextChange = (e) => {
		// auto adjust textarea height
		e.target.style.height = "";
		e.target.style.height = Math.min(e.target.scrollHeight, 300) + "px";
		setCancelText(e.target.value)
	}
	
	const handleCancelAppointment = (e) => {
		e.preventDefault()
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				id: appointment.appointment_id,
				message: cancelText
			}),
			credentials: 'include'
		}

		setCancelLoading(true)
		setCancelError('')

		fetch(`${API_URL}/api/appointment/admincancel?id=${appointment.appointment_id}}`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if(!mountedRef.current) return null
				if(!data.success){
					throw new Error(data.message)
				}
				onUpdate()
				
			})
			.catch(error=> {
				console.log(error)
				setCancelLoading(false)
				setCancelError(error.message)
			})
	}
	return (
		<div className="mb-2">
			<div className="appointment-info-upcoming-wrapper py-2 px-2">
				{/* {LOADING && ERROR} */}
				{
					isLoading ? <div className="text-center">
						<div className="spinner-border" role="status">
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
						<p style={{color: "black"}}><b>Datetime: {convertDateAndTimeRangeString(new Date(appointment.appointment_start), appointment.duration)} ({appointment.duration} minutes)</b></p>
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
			<div className="mt-2">
				{
					!showForm ?
						<button className="btn btn-danger float-end" onClick={() => setShowForm(true)}>
							cancel appointment
						</button>

						:
						(
							cancelLoading ?
								<button className="btn btn-danger py-1 float-end" type="button" disabled>
									<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
								</button>
								:
								<div>
									<form onSubmit={handleCancelAppointment} className="py-2">
										<textarea onChange={onCancelTextChange} className="form-control" id="cancelText" rows={5} wrap="soft" placeholder="write message here" />
										<button type="submit" title="delete" className="btn btn-danger my-2 float-end" >
											<span className="align-middle button-text" style={{ fontSize: 12 }}>confirm cancellation</span>
										</button>
									</form >
								</div>
						)
				}
			</div>
		</div>
	)
}

export default Appointment
