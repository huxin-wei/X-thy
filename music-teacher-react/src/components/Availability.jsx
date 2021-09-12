import React, { useState, useEffect, useRef } from 'react'
import { TiEdit, TiTrash } from 'react-icons/ti'
import { API_URL } from '../JS/variables';


function Availability({availability, removeAvailability}) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const mountedRef = useRef(true)

	const WEEK = [
		'Sun', 'Mon', 'Tu', 'Wed', 'Th', 'Fri', 'Sat'
	]

	const minutesToHhMmAPmString = (minutes) => {
		let hours = Math.floor(minutes / 60)
		const suffix = hours >= 12 ? "PM" : "AM"
		let minutePart = ((minutes % 60) + '0').substring(0, 2)
		hours = `${((hours + 11) % 12 + 1)}:${minutePart} ${suffix}`
		return hours
	}

	const start_time = minutesToHhMmAPmString(availability.start_minute)
	const end_time = minutesToHhMmAPmString(availability.end_minute)

	const getAvailDisplay = () => {
		let week = [0, 0, 0, 0, 0, 0, 0]
		let days = availability.days
		for (let i = 0; i < days.length; i++) {
			week[days[i]] = 1
		}

		return (
			<div style={{ margin: "10px auto" }}>
				{week.map((day, index) => {
					return (
						<div key={index} style={{ display: "inline-block", textAlign: "center", minWidth: 40, color: day ? 'orange' : '#eee' }}>{WEEK[index]}</div>
					)
				})}
			</div>
		)
	}

	const deleteAvailability = () => {
		setIsLoading(true)
		setError('')
		const requestionOptions =
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			credentials: 'include'
		}

		fetch(`${API_URL}/api/availability/delete/${availability.availability_id}`, requestionOptions)
			.then(res => res.json())
			.then(data => {
				if (!data.success) {
					throw new Error(data.message)
				}
				if (!mountedRef.current) return null
				setIsLoading(false)
				setError('')
				removeAvailability(availability.availability_id)
			})
			.catch(error => {
				if (!mountedRef.current) return null
				setIsLoading(false)
				setError(error.message)
			})
	}

	return (
		<div>
			<div className="mb-2 pd-4 default-wrapper mw-400">
				<div className="">
					<div className="mb-2">
						{getAvailDisplay()}
						<p className="mb-1 text-secondary"><b>{start_time} - {end_time}</b></p>
					</div>
					{/* <button type="button" title="edit" className="btn btn-secondary py-1">
                            <TiEdit size={20} />
                            <span className="align-middle" style={{ fontSize: 15 }}>EDIT</span>
                        </button> */}

					{/* {error warning} */}
					{error &&
						<div className="alert alert-danger" role="alert">
							{error}
						</div>
					}

					{/* {button panel} */}
					<div style={{ height: 30 }}>
						{
							isLoading ?
								<button className="btn btn-danger py-1 float-end" type="button" disabled>
									<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
									<span className="sr-only">Deleting...</span>
								</button>
								:
								<button onClick={deleteAvailability} type="button" title="delete" className="btn btn-danger py-1 float-end" >
									<TiTrash size={20} />
									<span className="align-middle button-text" style={{ fontSize: 10 }}>DELETE</span>
								</button>
						}
					</div>
				</div>
			</div>
		</div >
	)
}

export default Availability
