import React, { useState, useEffect } from 'react'
import { API_URL } from '../JS/variables'

function TimeOffer(props) {
	const [fetchErrors, setFetchErrors] = useState([])
	const [times, setTimes] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	// UTC TIME
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC

	useEffect(() => {
		setIsLoading(true)

		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}

		console.log(props.fullDate)
		let date = new Date(props.fullDate)
		let day = date.getDay()
		date = date.toUTCString()

		fetch(`${API_URL}/api/availability/offertime?day=${day}&duration=${props.duration}&utcDate=${date}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				if (!data.success) {
					console.log(data)
					throw new Error(data.message)
				}
				if (data.times.length === 0) {
					throw new Error("I'm not available today. Check another day or decrease session time.")
				}
				console.log(data)
				setIsLoading(false)
				setFetchErrors([])
				setTimes(data.times)
			})
			.catch((err) => {
				setTimes([])
				setIsLoading(false)
				if (Array.isArray(err)) {
					setFetchErrors(err)
					console.log('it is array')
				}
				else {
					setFetchErrors([err.message])
					console.log('err is not array')
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

	return (
		<div>
			{
				isLoading ?
					<div style={{ margin: "auto", textAlign: "center" }}>
						<div className="spinner-border text-warning" role="status">
						</div>
					</div>
					:
					<div>
						{
							times.map((time, index) => {
								let HHMMAPMstr = minutesToHhMmAPmString(time)
								return (
									<button key={index} type="button" className="btn btn-secondary mx-2 my-2" style={{ width: 100 }}
										onClick={(e) => {
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
