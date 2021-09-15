import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables'
import AppModal from './AppModal'
import Appointment from './Appointment'

function Calendar() {
	const [date, setDate] = useState(null)
	const [week, setWeek] = useState([])
	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [selectedAppt, setSelectedAppt] = useState('')
	const [dummy, setDummy] = useState(0)
	const mountedRef = useRef(true)

	const TIME = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
	]


	useEffect(() => {
		let beginDate = new Date() // beginning of the week (Sunday)
		beginDate.setHours(0)
		beginDate.setMinutes(0)
		beginDate.setMilliseconds(0)
		setDate(beginDate)

		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!date) return
		

		let aWeek = []
		let beginDate = new Date(date.setDate(date.getDate() - date.getDay())) // beginning of the week (Sunday)

				
		console.log(`date is: ... ${date}`)
		console.log(`begin date is: ... ${beginDate}`)

		beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate(), 0, 0, 0)
		
		console.log(`date is: ... ${date}`)
		console.log(`begin date is: ... ${beginDate}`)

		// push seven day in array
		for (let i = 0; i < 7; i++) {
			let dummyDate = new Date(beginDate)
			let aDate = dummyDate.setDate(beginDate.getDate() + i)
			aWeek.push(aDate)
		}

		console.log(`setting week to ${aWeek}`)
		setWeek(aWeek)
	}, [date])

	useEffect(async () => {
		if (!week.length || !date) return

		let n = 0

		//fetch appointment
		setError('')
		setIsLoading(true)
		let appointments = await fetchWeekAppointment().catch((error) => {
			setError(error.message)
			setIsLoading(false)
			console.log(error)
			console.log(++n)
		})

		if (!appointments) {
			setData([])
			console.log('in if !appointment')
			return
		}

		//find the ealiest time of a day
		let min = appointments.length ? appointments[0].minuteStart : 0
		console.log(++n)
		for (let i = 1; i < appointments.length; i++) {
			if (appointments[i].minuteStart < min) {
				min = appointments[i].minuteStart
			}
		}

		console.log('after find earliest day')

		// find the index of time to be used in calendar
		let indexToUse = Math.floor(min / 30)
		let timeCol = TIME.splice(indexToUse)

		console.log(++n)
		// create 2D array to store each row (timeCol.length * 8)
		let preparingData = new Array(timeCol.length)
		console.log(++n)
		for (let i = 0; i < preparingData.length; i++) {
			preparingData[i] = new Array('', '', '', '', '', '', '', '')
		}
		console.log(++n)
		// store time in first index of all data's index
		for (let i = 0; i < preparingData.length; i++) {
			preparingData[i][0] = {
				type: 'time',
				data: timeCol[i]
			}
		}
		console.log(++n)
		let startDate = new Date(week[0])
		let saturday = new Date(week[6])
		let endDate = saturday.setDate(saturday.getDate() + 1)
		// store appointment in 2D array
		appointments.forEach(appt => {
			let duration = appt.duration
			let aDate = new Date(appt.appointmentStart)
			console.log(`aappointment start: ${aDate}`)
			console.log(`start date: ${startDate}`)
			console.log(`end date: ${endDate}`)
			console.log('in for each')
			if (aDate >= startDate && aDate < endDate) {
				console.log(++n)
				let colIndex = aDate.getDay() + 1 //first column is time, thus add 1

				// find a row to push appt in
				let rowIndex = Math.floor((appt.minuteStart - min) / 30)

				preparingData[rowIndex][colIndex] = {
					type: 'appointment',
					data: appt
				}

				// span row will overlap - assign the following rows in the same column to be blank when draw table
				let numSpan = Math.floor(duration / 30) - 1 // subtract one because first row already assign

				for (let i = 0; i < numSpan; i++) {
					preparingData[++rowIndex][colIndex] = {
						type: 'spanned'
					}
				}
			}
		})
		console.log('final')

		setIsLoading(false)
		setError('')
		setData(preparingData)
	}, [week, dummy])

	const fetchWeekAppointment = () => {
		return new Promise((resolve, reject) => {
			const requestOptions = {
				credentials: 'include'
			}
			// console.log('date that i will fetch', date)
			// console.log('date that i will fetch utc', date.toUTCString())
			fetch(`${API_URL}/api/appointment/week?utcDate=${date.toUTCString()}`, requestOptions)
				.then(res => res.json())
				.then(data => {
					if (!mountedRef) return null
					if (!data.success) {
						throw new Error(data.message)
					}

					let appointments = data.appointments.map(appt => {
						return {
							appointmentId: appt.appointment_id,
							customerName: appt.customer_name,
							lessonName: appt.lesson_name,
							appointmentStart: new Date(appt.appointment_start),
							duration: appt.duration,
							minuteStart: dateToMinuteStart(new Date(appt.appointment_start))
						}

					})
					console.log(`appointments:\n`)
					console.log(appointments)
					resolve(appointments)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const refresh = () => {
		setDummy(dummy + 1)
	}

	const dateToMinuteStart = (date) => {
		return date.getHours() * 60 + date.getMinutes()
	}

	const handleChangeWeek = (numWeek) => {
		let d = new Date(date)
		d.setDate(d.getDate() + (7 * numWeek))
		setDate(d)
	}

	const formatDate = (datevalue) => {
		let date = new Date(datevalue),
			day = date.getDate(),
			month = date.getMonth(),
			year = date.getFullYear(),
			months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			dayOfWeek = date.getDay()

		return weeks[dayOfWeek] + ' ' + day + ' ' + months[month] + ' ' + year;
	}

	const minutesToHhMmAPmString = (minutes) => {
		let hours = Math.floor(minutes / 60)
		const suffix = hours >= 12 ? "PM" : "AM"
		let minutePart = ((minutes % 60) + '0').substring(0, 2)
		hours = `${((hours + 11) % 12 + 1)}:${minutePart} ${suffix}`
		return hours
	}

	const convertDateAndTimeRangeString = (date, duration) => {
		let start_time_string = minutesToHhMmAPmString(Math.floor(date.getHours()) * 60 + date.getMinutes())
		let end_time_string = minutesToHhMmAPmString(Math.floor(date.getHours()) * 60 + date.getMinutes() + duration)

		return `${start_time_string} - ${end_time_string}`
	}

	const handleApptClicked = (e) => {
		e.preventDefault()
		setSelectedAppt(e.currentTarget.id)
	}

	return (
		<div>
			{
				isLoading ?
					<div className="text-center">
						<div className="spinner-border" role="status" style={{ color: "orange" }}>
						</div>
					</div>
					: (error &&
						<div className="alert alert-danger" role="alert">
							{error}
						</div>
					)

			}
			<div className="mx-auto text-center" style={{ overflowY: "auto", maxHeight: "100vh" }}>
				<div className="mw-1000 mx-auto my-3">
					<button className="me-5" onClick={() => handleChangeWeek(-1)}>previous</button>
					<input type="date" onChange={(e) => setDate(new Date(e.target.value))}/>
					<button onClick={() => refresh()}>refresh</button>
					<button className="ms-5" onClick={() => handleChangeWeek(1)}>next</button>
				</div>
				<div className="mw-1000 mx-auto" style={{ overflowX: "scroll", maxHeight: "90vh" }}>
					<table className="calendar">
						<thead>
							<tr>
								<th style={{ maxWidth: 60 }}></th>
								{
									week.map((day, index) => {
										let [w, d, m, y] = formatDate(day).split(' ')
										return (
											<th className="head-fixed" key={index}>
												<p>{w}</p>
												<p>{d} {m} {y}</p>
											</th>
										)
									})
								}
							</tr>
						</thead>
						<tbody>
							<tr>
								<th className="header-fixed"></th>
								<td colSpan={7} style={{height: "20px"}}></td>
							</tr>
							{
								data.map((row, index) => {
									return (
										<tr key={index}>
											{
												row.map((col, index) => {
													switch (col.type) {
														case 'appointment':
															let appt = col.data
															return (
																<td className="td-with-data" rowSpan={Math.floor(appt.duration / 30)} key={index}>
																	<div id={appt.appointmentId} onClick={handleApptClicked}>
																		<p>{convertDateAndTimeRangeString(appt.appointmentStart, appt.duration)}</p>
																		<p>{appt.lessonName}</p>
																		<p>{appt.customerName}</p>
																		<p>{appt.duration} minutes</p>
																		<p>{appt.appointmentId}</p>
																	</div>
																</td>
															)

														case 'time':
															return (
																<th className="header-fixed" key={index} style={{verticalAlign: "top"}}>
																	<div style={{minHeight: 25}}>
																	<p className="time" style={{position: "absolute", top: -12, right: 5}}>{col.data}</p>
																	</div>
																</th>
															)
														case 'spanned':
															return
														default:
															return (
																<td key={index}></td>
															)
													}
												})
											}
										</tr>
									)
								})
							}
						</tbody>
					</table>
				</div>
			</div>

			{
				selectedAppt &&
				<AppModal
					show={selectedAppt ? true : false}
					onClose={() => setSelectedAppt('')}
					title={`Appointment: ${selectedAppt}`}>
					<Appointment 
						id={selectedAppt} 
						onUpdate={() => {
							refresh()
							setSelectedAppt('')
						}} 
					/>
				</AppModal>
			}

		</div>
	)
}

export default Calendar
