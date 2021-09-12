import React, { useState, useEffect, useRef } from 'react'
import { Switch, Route, NavLink } from 'react-router-dom';
import Appointment from './Appointment';
import { API_URL } from '../JS/variables';


function AppointmentPanel() {
	const [mode, setMoede] = useState('upcoming')
	const [appointments, setAppointments] = useState([])
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const mountedRef = useRef(true)

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		const now = new Date()
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			credentials: 'include'
		}

		fetch(`${API_URL}/api/appointment/${mode}?now=${now}`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if (!mountedRef.current) return null
				if (!data.success) {
					throw new Error(data.message)
				}
				let apps = data.appointments
				apps.sort(function (a, b) {
					var key1 = a.appointment_start;
					var key2 = b.appointment_start;

					if (key1 < key2) {
						return -1;
					} else if (key1 == key2) {
						return 0;
					} else {
						return 1;
					}
				});
				setAppointments(apps)
				setError('')
				setIsLoading(false)
			})
			.catch(error => {
				if (!mountedRef.current) return null
				console.log(error)
				setError(error.message)
				setIsLoading(false)
			})

	}, [mode])

	const changeMode = (e) => {
		setMoede(e.target.id)
	}
	return (
		<div>
			<div className="appointment-panel py-4 mx-auto">
				<section>
					<div className="btn-group btn-group-sm mb-2" role="group">
						<button
							id="upcoming"
							className={mode == "upcoming" ? "appointment-menu-btn appointment-menu-btn--active" : "appointment-menu-btn"}
							onClick={e => changeMode(e)}
						>
							Upcoming
						</button>

						<button
							id="history"
							className={mode == "history" ? "appointment-menu-btn appointment-menu-btn--active" : "appointment-menu-btn"}
							onClick={e => changeMode(e)}
						>
							history
						</button>
						<button
							id="cancelled"
							className={mode == "cancelled" ? "appointment-menu-btn appointment-menu-btn--active" : "appointment-menu-btn"}
							onClick={e => changeMode(e)}
						>
							cancelled
						</button>
					</div>
				</section>
				<section>
					{
						appointments.map(app => {
							return (
								<Appointment
									key={app.appointment_id}
									id={app.appointment_id}
									name={app.customer_name}
									time={new Date(app.appointment_start)}
									duration={app.duration} />
							)
						})
					}
				</section>

			</div>
		</div>
	)
}

export default AppointmentPanel
