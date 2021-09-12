import React, { useState, useEffect, useRef } from 'react'



function Calendar() {
	const [date, setDate] = useState(new Date())
	const [week, setWeek] = useState([])
	const [data, setData] = useState([])
	const mountedRef = useRef(true)

	const TIME = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
	]


	useEffect(() => {

		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!date) return

		let aWeek = []
		let beginDate = new Date(date.setDate(date.getDate() - date.getDay()))


		beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate())

		// push seven day in array
		for (let i = 0; i < 7; i++) {
			let dummyDate = new Date(beginDate)
			let aDate = dummyDate.setDate(beginDate.getDate() + i)
			aWeek.push(aDate)
		}

		console.log(aWeek)

		setWeek(aWeek)
	}, [date])

	useEffect(() => {
		if (!week.length) return

		//fetch appointment
		let appointments = [
			{
				name: 'cat',
				appointmentStart: new Date('2021-9-18'),
				minuteStart: 120,
				duration: 600,
			},
			{
				name: 'dog',
				appointmentStart: new Date('2021-9-17'),
				minuteStart: 600,
				duration: 30
			},
			{
				name: 'bird',
				appointmentStart: new Date('2021-9-15'),
				minuteStart: 690,
				duration: 150
			},
			{
				name: 'fish',
				appointmentStart: new Date('2021-9-15'),
				minuteStart: 630,
				duration: 60
			}
		]

		//find the ealiest time of a day
		let min = appointments.length ? appointments[0].minuteStart : 0

		for (let i = 1; i < appointments.length; i++) {
			if (appointments[i].minuteStart < min) {
				min = appointments[i].minuteStart
			}
		}

		// find the index of time to be used in calendar
		let indexToUse = Math.floor(min / 30)
		let timeCol = TIME.splice(indexToUse)

		// create 2D array to store each row (timeCol.length * 8)
		let preparingData = new Array(timeCol.length)

		for (let i = 0; i < preparingData.length; i++) {
			preparingData[i] = new Array('', '', '', '', '', '', '', '')
		}

		// store time in first index of all data's index
		for (let i = 0; i < preparingData.length; i++) {
			preparingData[i][0] = {
				type: 'time',
				data: timeCol[i]
			}
		}

		let startDate = new Date(week[0])
		let saturday = new Date(week[6])
		let endDate = saturday.setDate(saturday.getDate() + 1)
		// store appointment in 2D array
		appointments.forEach(appt => {
			if (appt.appointmentStart >= startDate && appt.appointmentStart < endDate) {
				let colIndex = appt.appointmentStart.getDay() + 1 //first column is time, thus add 1

				// find a row to push appt in
				let rowIndex = Math.floor((appt.minuteStart - min) / 30)

				preparingData[rowIndex][colIndex] = {
					type: 'appointment',
					data: appt
				}

				// span row will overlap - assign the following rows to be blank when draw table
				let numSpan = Math.floor(appt.duration / 30) - 1 // subtract one because first row already assign

				for (let i = 0; i < numSpan; i++) {
					preparingData[++rowIndex][colIndex] = {
						type: 'spanned'
					}
				}



			}
			else {
				return
			}
		})

		setData(preparingData)
	}, [week])

	const handleChangeWeek = (numWeek) => {
		let d = new Date(date)
		d.setDate(d.getDate()  + 7 * numWeek)
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


	return (
		<div>
			<div className="mx-auto text-center">
				<div className="mw-1000 mx-auto my-3">
					<button className="me-5"  onClick={() => handleChangeWeek(-1)}>previous</button>
					<button className="ms-5" onClick={() => handleChangeWeek(1)}>next</button>
				</div>
				<div className="mw-1000 mx-auto" style={{overflowX: "scroll", height: "90vh"}}>
					<table className="calendar">
						<thead>
							<tr>
								<th style={{ maxWidth: 60 }}></th>
								{
									week.map((day, index) => {
										let [w, d, m, y] = formatDate(day).split(' ')
										console.log(w)
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
							{
								data.map((row, index) => {
									return (
										<tr key={index}>
											{
												row.map((col, index) => {
													switch (col.type) {
														case 'appointment':
															return (
																<td className="td-with-data" rowSpan={Math.floor(col.data.duration / 30)}  key={index}>
																	<div>
																		<p>the appointment</p>
																	</div>
																</td>
															)

														case 'time':
															return (
																<th className="header-fixed"  key={index}>
																	{col.data}
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
		</div>
	)
}

export default Calendar
