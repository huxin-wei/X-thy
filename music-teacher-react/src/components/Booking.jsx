import React, { useState, useEffect, useRef } from 'react'
import DatePicker from './DatePicker'
import TimeOffer from './TimeOffer'
import ClassOffer from './ClassOffer'
import { API_URL } from '../JS/variables';

const today = new Date()
const initDate = today.getDate()
const initMonth = today.getMonth() + 1
const initYear = today.getFullYear()
const INIT_FULLDATE = `${initYear}-${initMonth}-${initDate}`
const INIT_DURATION = 60

function Booking(props) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [note, setNote] = useState('')
	const [duration, setDuration] = useState(INIT_DURATION)
	const [fullDate, setFullDate] = useState(INIT_FULLDATE)
	const [lesson, setLesson] = useState(null)
	const [fullTime, setFullTime] = useState('')
	const [submitErrors, setSubmitErrors] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [bookingSuccess, setBookingSuccess] = useState(false)
	const [dummy, setDummy] = useState(0)

	const mountedRef = useRef(true)


	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	const signalBookingSuccess = () => {
		setDummy(dummy + 1)
		setBookingSuccess(true)
		setTimeout(() => {
			if(!mountedRef.current) return null
			setBookingSuccess(false)
		}, 7000)
	}

	useEffect(() => {
		setFullTime('')
	}, [fullDate, duration])

	const handleDateChange = (date, month, year) => {
		setFullDate(year + '-' + (month + 1) + '-' + date)
	}

	const onDurationChange = (e) => {
		setDuration(e.target.value)
	}


	const handleSubmit = () => {
		let errors = [
			...(lesson ? [] : ['Lesson is missing. Please select a lesson']),
			...(fullDate ? [] : ['Date is missing. Please select date']),
			...(fullTime ? [] : ['Time is missing. Please select time.']),
			...(name ? [] : ['Name is required.']),
			...(email ? [] : ['Email address is required.']),
			...(duration > 0 && duration % 30 == 0 ? [] : ['Select session duration.'])
		]
		if (errors.length) {
			return setSubmitErrors(errors)
		}

		// convert to utc date
		let d = new Date(`${fullDate} ${fullTime}`)
		d = d.toUTCString()

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				email: email,
				phone: phone,
				note: note,
				date: d,
				duration: duration,
				lessonId: lesson.lessonId
			})
		}

		setIsLoading(true)
		setSubmitErrors([])

		fetch(`${API_URL}/api/booking`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if (!mountedRef.current) return null
				if (!data.success) {
					throw new Error(data.message)
				}
				setSubmitErrors([])
				setIsLoading(false)
				setFullTime('')
				signalBookingSuccess()
			})
			.catch(error => {
				if (!mountedRef.current) return null
				if (Array.isArray(error)) {
					console.log('1', error)
					setSubmitErrors(error)
				}
				else {
					console.log('2', error)
					setSubmitErrors([error.message])
				}
				setIsLoading(false)
			})
	}

	return (
		<div style={{ maxWidth: 600, margin: "auto", padding: "40px 0px 150px 0px" }}>
			{/* {CLASS selection} */}
			<section>
				<div className="guide-banner mb-4">
					<h3>Select class</h3>
				</div>
				<ClassOffer selectLesson={setLesson} />

			</section>

			{/* {SESSION DURATION selection} */}
			<section>
				<div className="guide-banner my-4">
					<h3>Select session duration</h3>
				</div>
				<div>
					<div style={{ width: 200, margin: "20px auto" }}>
						<select className="form-select" defaultValue={duration} aria-label="Default select example" onChange={onDurationChange}>
							<option value="30">30 minutes</option>
							<option value="60">1 hour</option>
							<option value="90">1 hour 30 minutes</option>
							<option value="120">2 hours</option>
							<option value="150">2 hours 30 minutes</option>
							<option value="180">3 hours</option>
							<option value="210">3 hours 30 minutes</option>
							<option value="240">4 hours</option>
						</select>
					</div>
				</div>
			</section>

			{/* {DATE selection section} */}
			<section>
				<div className="guide-banner my-4">
					<h3>Select date</h3>
				</div>
				<DatePicker date={initDate} month={initMonth - 1} year={initYear} onDateChange={handleDateChange} />
			</section>

			{/* {TIME selection section} */}
			<section>
				<div className="guide-banner my-4">
					<h3>Select time</h3>
				</div>
				<TimeOffer duration={duration} fullDate={fullDate} onTimeSelected={setFullTime} dummy={dummy} />
			</section>

			{/* ...... {student information} ......... */}
			<section>
				<div className="guide-banner my-4">
					<h3>Your information</h3>
				</div>
				<form className="form-default-box">
					<div className="mb-3">
						<label htmlFor="name" className="form-label"><b>Name</b> </label>
						<input type="text" length={50} className="form-control" id="name" required
							onChange={(e) => { setName(e.target.value) }}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="email" className="form-label"><b>Email</b></label>
						<input type="email" length={50} className="form-control" id="email" required
							onChange={(e) => { setEmail(e.target.value) }}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="phone" className="form-label"><b>Phone</b></label>
						<input type="tel" length={20} className="form-control" id="phone"
							onChange={(e) => { setPhone(e.target.value) }}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="note" className="form-label"><b>Note</b></label>
						<textarea className="form-control" id="description" rows={5} wrap="soft"
							onChange={(e) => { setNote(e.target.value) }}
						/>
					</div>
				</form>
			</section>

			{/* {summary table} */}
			<section>
				<div className="guide-banner my-4">
					<h3>Confirm details & Book appointment</h3>
				</div>
				<table className="table mb-4" style={{ margin: "auto", maxWidth: 600 }}>
					<tbody>
						<tr className="table-primary">
							<td colSpan="2">
								<b>Your information</b>
							</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Name</td>
							<td>{name}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Email</td>
							<td>{email}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Phone</td>
							<td>{phone}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag" style={{ verticalAlign: "top" }}>Note</td>
							<td>{note}</td>
						</tr>
						<tr className="table-primary">
							<td colSpan="2"><b>Appointment information</b></td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Class</td>
							<td>{lesson && lesson.lessonName}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Class ID</td>
							<td>{lesson && lesson.lessonId}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Date</td>
							<td>{fullDate}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Time</td>
							<td>{fullTime}</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Duration</td>
							<td>{duration} minutes</td>
						</tr>
						<tr className="table-light">
							<td className="booking-info-tag">Fee</td>
							<td>${lesson && lesson.price60m * Math.floor(duration / 60) + lesson.price30m * (duration % 60 == 30 ? 1 : 0)} (pay at the study date)</td>
						</tr>
					</tbody>
				</table>

				{
					submitErrors.length > 0 &&
					<div className="alert alert-danger" role="alert">
						<ul>
							{
								submitErrors.map((error, index) => {
									return (
										<li key={index}>{error}</li>
									)
								})
							}
						</ul>
					</div>
				}

			{
				bookingSuccess &&
				<div className="alert alert-success" role="alert">
					<p>Successfully booked. Booking details will be sent to your email address.</p>
					<p>You can continue booking on this page.</p>
				</div>
			}

				{
					isLoading ?
						<button className="btn btn-primary float-end" type="button" disabled>
							<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							<span className="sr-only">Loading...</span>
						</button>
						:
						<button className="btn btn-primary d-inline-block float-end" onClick={() => { handleSubmit() }}>Book now</button>
				}
			</section>
		</div>
	)
}


export default Booking
//handleDateChange={handleDateChange}

{/* <button className="btn btn-primary float-end mt-3"
onClick={() => {handleSubmit()}}>
	BOOK APPOINTMENT
</button> */}