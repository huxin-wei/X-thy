import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables'
import AppModal from './AppModal'
import Appointment from './Appointment'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { GrRefresh } from 'react-icons/gr'

function Calendar() {
	const [date, setDate] = useState(null)
	const [dateInputDisplay, setDateInputDisplay] = useState('')
	const [week, setWeek] = useState([])
	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [selectedAppt, setSelectedAppt] = useState('')
	const [dummy, setDummy] = useState(0)
	const mountedRef = useRef(true)

	const changeInputDateToFirstDayOfWeek = (d) => {
		d.setDate(d.getDate() - d.getDay())
		d.setHours(0)
		d.setMinutes(0)
		d.setSeconds(0)
	}

	useEffect(() => {
		let today = new Date()
		setDateInputDisplay(formatDate2(today))
		changeInputDateToFirstDayOfWeek(today)
		setDate(today)

		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!date) return

		let aWeek = []

		let beginDate = new Date(date) // beginning of the week (Sunday)
		changeInputDateToFirstDayOfWeek(beginDate)

		// push seven day in array
		for (let i = 0; i < 7; i++) {
			let dummyDate = new Date(beginDate)
			let aDate = dummyDate.setDate(beginDate.getDate() + i)
			aWeek.push(aDate)
		}
		setWeek(aWeek)
	}, [date])

	useEffect(() => {
		const fetchWeekAppointment = () => {
			return new Promise((resolve, reject) => {
				const requestOptions = {
					credentials: 'include'
				}
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
						resolve(appointments)
					})
					.catch(error => {
						reject(error)
					})
			})
		}

		async function processWeekAppointment() {
			if (!week.length || !date) return

			//fetch appointment
			setError('')
			setIsLoading(true)
			let appointments = await fetchWeekAppointment().catch((error) => {
				setError(error.message)
				setIsLoading(false)
			})

			if (!appointments) {
				setData([])
				return
			}

			//find the ealiest time of a day
			let min = appointments.length ? appointments[0].minuteStart : 0

			for (let i = 1; i < appointments.length; i++) {
				if (appointments[i].minuteStart < min) {
					min = appointments[i].minuteStart
				}
			}

			// find the index of time to be used in calendar
			let indexToUse = Math.floor(min / 30)
			const TIME = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']
			let timeCol = TIME.splice(indexToUse)

			// create 2D array to store each row (timeCol.length * 8)
			let preparingData = new Array(timeCol.length)

			for (let i = 0; i < preparingData.length; i++) {
				preparingData[i] = ['', '', '', '', '', '', '', '']
			}

			// store time in first index of all data's index
			for (let i = 0; i < preparingData.length; i++) {
				preparingData[i][0] = {
					type: 'time',
					data: timeCol[i]
				}
			}

			let startDate = new Date(week[0])
			let endDate = new Date(startDate)
			endDate.setDate(endDate.getDate() + 7)

			// store appointment in 2D array
			appointments.forEach(appt => {
				let duration = appt.duration
				let aDate = new Date(appt.appointmentStart)

				if (aDate >= startDate && aDate < endDate) {
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

			setIsLoading(false)
			setError('')
			setData(preparingData)
		}

		processWeekAppointment()

	}, [week, dummy])

	const refresh = () => {
		setDummy(dummy + 1)
	}

	const dateToMinuteStart = (date) => {
		return date.getHours() * 60 + date.getMinutes()
	}

	const handleWeekChange = (numWeek) => {
		let d = new Date(date)
		d.setDate(d.getDate() + (7 * numWeek))

		let dDisplay = new Date(dateInputDisplay)
		dDisplay.setDate(dDisplay.getDate() + (7 * numWeek))

		setDateInputDisplay(formatDate2(dDisplay))
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

	function formatDate2(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [year, month, day].join('-');
	}

	// <div style={{ textAlign: "center" }}>
	// 	<button onClick={decrementYear} className="float-start arrow-spinner" >
	// 		<FaAngleLeft size={25} />
	// 	</button>
	// 	<span style={{ fontSize: 20 }}>{year}</span>
	// 	<button onClick={incrementYear} className="float-end arrow-spinner">
	// 		<FaAngleRight size={25} />
	// 	</button>
	// </div>
	// <button onClick={decrementYear} className="float-start arrow-spinner" >
	// 	<FaAngleLeft size={25} />
	// </button>
	return (
		<div>
			{
				error &&
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			}
			<div className="mx-auto text-center" style={{ overflowY: "auto", maxHeight: "100vh" }}>
				<div className="mw-1000 mx-auto my-3">
					<input type="date" value={dateInputDisplay}
						onChange={(e) => {
							let d = new Date(e.target.value)
							setDateInputDisplay(formatDate2(d))
							changeInputDateToFirstDayOfWeek(d)
							setDate(d)
						}} />





				</div>
				<div className="mw-1000 mx-auto" style={{ overflowX: "scroll", maxHeight: "90vh" }}>
					<table className="calendar" style={isLoading ? { backgroundColor: "#efefef" } : {}}>
						<thead>
							<tr>
								<th className="header-fixed" style={{ maxWidth: 60, padding: 5 }}>
									<div>
										<button className="float-start circle" onClick={() => handleWeekChange(-1)}>
											<FaAngleLeft size={25} />
										</button>
										<button className="refresh">
											<GrRefresh title="refresh" color="white" onClick={() => refresh()} />
										</button>
										<button className="float-end circle" onClick={() => handleWeekChange(1)}>
											<FaAngleRight size={25} />
										</button>

									</div>
								</th>
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
						<tbody >
							<tr>
								<th className="header-fixed"></th>
								<td colSpan={7} style={{ height: "20px" }}></td>
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
																<th className="header-fixed" key={index} style={{ verticalAlign: "top" }}>
																	<div style={{ minHeight: 25 }}>
																		<p className="time" style={{ position: "absolute", top: -12, right: 5 }}>{col.data}</p>
																	</div>
																</th>
															)
														case 'spanned':
															return null
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
