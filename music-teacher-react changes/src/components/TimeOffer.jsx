import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables'

function TimeOffer(props) {
	const [fetchErrors, setFetchErrors] = useState([])
	const [times, setTimes] = useState([])
	const [selectedTime, setSelectedTime] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const mountedRef = useRef(true)

	// UTC TIME
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		setIsLoading(true)

		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}

		let date = new Date(props.fullDate)
		let day = date.getDay()
		date = date.toUTCString()

		fetch(`${API_URL}/api/availability/offertime?day=${day}&duration=${props.duration}&utcDate=${date}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				if(!mountedRef.current) return null
				if (!data.success) {
					throw new Error(data.message)
				}
				if (data.times.length === 0) {
					throw new Error("Not available. Check other days or decrease session time.")
				}
				setIsLoading(false)
				setFetchErrors([])

				data.times.sort((a,b) => new Date(a) - new Date(b))
				setTimes(data.times)
			})
			.catch((err) => {
				if(!mountedRef.current) return null
				setTimes([])
				setIsLoading(false)
				if (Array.isArray(err)) {
					setFetchErrors(err)
				}
				else {
					setFetchErrors([err.message])
				}
				console.log(err)
			})
	}, [props.fullDate, props.duration, props.dummy])

	const minutesToHhMmAPmString = (minutes) => {
		let hours = Math.floor(minutes / 60)
		const suffix = hours >= 12 ? "PM" : "AM"
		let minutePart = ((minutes % 60) + '0').substring(0, 2)
		hours = `${((hours + 11) % 12 + 1)}:${minutePart} ${suffix}`
		return hours
	}

	const getTotalMinutesFromDate = (date) => {
		return date.getHours() * 60 + date.getMinutes()
	}

	return (
		<div>
			{
				isLoading ?
					<div style={{ margin: "auto", textAlign: "center" }}>
						<div className="spinner-border text-warning" role="status">
						</div>
					</div>
					:
					<div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
						{
							times.map((time, index) => {
								const date = new Date(time)
								const minutes = getTotalMinutesFromDate(date)
								let HHMMAPMstr = minutesToHhMmAPmString(minutes)
								return (
									<button key={index} 
									type="button" 
									value={HHMMAPMstr} 
									className={`btn ${ HHMMAPMstr == selectedTime? 'btn-primary' : 'btn-secondary'} mx-1 my-1`} 
									style={{ width: 80, fontSize: 12 }}
										onClick={(e) => {
											setSelectedTime(HHMMAPMstr)
											props.onTimeSelected(HHMMAPMstr)
										}}
									>{HHMMAPMstr}</button>
								)
							})

						}
					</div>
			}
			{
				fetchErrors.map((error, index) => {
					return (
						<div key={index} className="alert alert-danger" role="alert">
							{error}
						</div>
					)
				})
			}
		</div>
	)
}

export default TimeOffer
