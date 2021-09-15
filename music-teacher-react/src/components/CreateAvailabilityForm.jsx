import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables'

const EVERYDAY_INDEX = 7


function CrateAvailabilityForm(props) {
	const DAYS = [
		{ id: 0, day: 'Sun', isChecked: false },
		{ id: 1, day: 'Mon', isChecked: false },
		{ id: 2, day: 'Tu', isChecked: false },
		{ id: 3, day: 'Wed', isChecked: false },
		{ id: 4, day: 'Th', isChecked: false },
		{ id: 5, day: 'Fri', isChecked: false },
		{ id: 6, day: 'Sat', isChecked: false },
		{ id: 7, day: 'Everyday', isChecked: false },
	]

	const [timeFrom, setTimeFrom] = useState('')
	const [timeTo, setTimeTo] = useState('')
	const [selectedDays, setSelectedDays] = useState(DAYS)
	const [isLoading, setIsLoading] = useState(false)
	const [fetchErrors, setFetchErrors] = useState([])
	const [dateError, setDateError] = useState('')
	const [dayError, setDayError] = useState('')
	const [fromH, setFromH] = useState(0)
	const [fromM, setFromM] = useState(0)
	const [fromAP, setFromAP] = useState('AM')
	const [toH, setToH] = useState(0)
	const [toM, setToM] = useState(0)
	const [toAP, setToAP] = useState('AM')

	const mountedRef = useRef(true)

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	const getFromMinute = () => {
		return (fromH * 1 + (fromAP === 'AM'? 0 : 12)) * 60 + fromM * 1
	}

	const getToMinute = () => {
		// to midnight
		console.log(toH)
		console.log(toM)
		console.log(toAP)
		if (toH * 1 == 0 && toM * 1 == 0 && toAP == 'AM'){
			console.log('visit')
			return 24*60
		}
		return (toH * 1 + (toAP === 'AM'? 0 : 12)) * 60 + toM * 1
	}

	const handleAddAvailability = (e) => {
		e.preventDefault()
		let timeFrom = getFromMinute()
		let timeTo = getToMinute()


		if(timeFrom >= timeTo){
			console.log('timefrom', timeFrom)
			console.log('timeto', timeTo)
			return setFetchErrors(['Incorrect time.'])
		}

		console.log('after')

		if (!mountedRef.current) {
			console.log('mountedRef false')
			return null
		}
		setFetchErrors([])
		setIsLoading(true)

		console.log('1')
		const days = getSelectedDaysValue()

		if (!days) {
			setDayError('At least one day must be selected.')
			setIsLoading(false)
			return
		} else {
			setDayError('')
		}
		console.log('2')

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				timeFrom: timeFrom,
				timeTo: timeTo,
				days: getSelectedDaysValue()
			}),
			credentials: 'include'
		}

		fetch(`${API_URL}/api/availability/`, requestOptions)
			.then(res => {
				if (res.status === 401) {
					throw new Error('Unauthorized.')
				}
				return res
			})
			.then(res => res.json())
			.then((data) => {
				console.log('data: ', data)
				if (!mountedRef.current) return null
				console.log('yo')
				if (!data.success) {
					throw new Error(data.message)
				}
				props.handleClose()
				props.signalAddSuccess()
			})
			.catch((err) => {
				if (!mountedRef.current) return null
				if (Array.isArray(err)) {
					console.log('1', err)
					setFetchErrors(err)
				}
				else {
					console.log('2', err)
					setFetchErrors([err.message])
				}
				setIsLoading(false)
			})
	}

	console.log('Create availability form re render')

	// return 056 if Sun, Fri, Sat is checked
	const getSelectedDaysValue = () => {
		let val = ''
		selectedDays.map(day => {
			if (day.id == EVERYDAY_INDEX) { return }
			if (day.isChecked) {
				val += day.id
			}
		})
		return val
	}

	const onTimeFromChange = (e) => {
		let time = destructHHMM(e.target.value)

		if (timeTo == '' || time < timeTo) {
			setTimeFrom(time)
			if (dateError) {
				setDateError('')
			}
		} else {
			e.target.value = ''
			setDateError('Must be lesser.')
		}
	}

	const onTimeToChange = (e) => {
		let time = destructHHMM(e.target.value)

		if (timeFrom == '' || time > timeFrom) {
			setTimeTo(time)
			if (dateError) {
				setDateError('')
			}
		} else {
			e.target.value = ''
			setDateError('Must be greater.')
		}
	}

	const destructHHMM = (hhmmStr) => {
		let list = hhmmStr.split(':')
		return list[0] * 60 + list[1] * 1
	}

	const onSelectedDayChange = (e) => {
		setSelectedDays(selectedDays.map(day => {
			if (e.target.id == 7) {
				selectedDays.map(d => {
					d.isChecked = e.target.checked
				})
			} else {
				if (e.target.id == day.id) {
					day.isChecked = e.target.checked
					selectedDays[7].isChecked = false
				}
			}

			return {
				...day
			}
		}))
		console.log(selectedDays)
	}

	return (
		<div>
			<div className="mt-3 mb-3">
				<form className="form-default-box" onSubmit={handleAddAvailability} style={{ margin: "auto", maxWidth: 320 }}>

					{/* {TIME INPUTS} */}
					<div className="py-1" style={{ textAlign: "center" }}>
						<b>From</b>
					</div>
					<div style={{ margin: "5px auto", width: "100%", textAlign: "center" }}>
						<div style={{ display: "inline-block" }}>
							<select className="form-select" defaultValue={fromH} name="fromH" id="fromH"					
							onChange={(e) => {
									setFromH(e.target.value)
								}}>
								<option value="0">12</option>
								<option value="1">01</option>
								<option value="2">02</option>
								<option value="3">03</option>
								<option value="4">04</option>
								<option value="5">05</option>
								<option value="6">06</option>
								<option value="7">07</option>
								<option value="8">08</option>
								<option value="9">09</option>
								<option value="10">10</option>
								<option value="11">11</option>
							</select>
						</div>
						&nbsp;<b>:</b>&nbsp;
						<div style={{ display: "inline-block" }}>
							<select className="form-select" defaultValue={fromM} name="fromM" id="fromM" 
							onChange={(e) => {
								setFromM(e.target.value)
							}}>
								<option value="0">00</option>
								<option value="30">30</option>
							</select>
						</div>
						&nbsp;
						<div style={{ display: "inline-block" }}>
							<select className="form-select" defaultValue={fromAP} name="fromAP" id="fromAP" 
							onChange={(e) => {
								setFromAP(e.target.value)
							}}>
								<option value="AM">AM</option>
								<option value="PM">PM</option>
							</select>
						</div>
					</div>

					<div className="py-1" style={{ textAlign: "center" }}>
						<b>To</b>
					</div>
					<div style={{ margin: "5px auto", width: "100%", textAlign: "center" }}>
						<div style={{ display: "inline-block" }}>
							<select className="form-select" defaultValue={toH} name="toH" id="toH" 
								onChange={(e) => {
									setToH(e.target.value)
								}}>
								<option value="0">12</option>
								<option value="1">01</option>
								<option value="2">02</option>
								<option value="3">03</option>
								<option value="4">04</option>
								<option value="5">05</option>
								<option value="6">06</option>
								<option value="7">07</option>
								<option value="8">08</option>
								<option value="9">09</option>
								<option value="10">10</option>
								<option value="11">11</option>
							</select>
						</div>
						&nbsp;<b>:</b>&nbsp;
						<div style={{ display: "inline-block" }}>
							<select className="form-select" defaultValue={toM} name="toM" id="toM" 
								onChange={(e) => {
									setToM(e.target.value)
								}}>
								<option value="0">00</option>
								<option value="30">30</option>
							</select>
						</div>
						&nbsp;
						<div style={{ display: "inline-block" }}>
							<select className="form-select" defaultValue={toAP} name="toAP" id="toAP" 
								onChange={(e) => {
									setToAP(e.target.value)
								}}>
								<option value="AM">AM</option>
								<option value="PM">PM</option>
							</select>
						</div>
					</div>

					<div className="form-check">
						{selectedDays.map((day) => {
							return (
								<div key={day.id}>
									<input className="form-check-input" type="checkbox" id={day.id} onChange={onSelectedDayChange} checked={day.isChecked} />
									<label className="form-check-label" htmlFor={day.id}>{day.day}</label>
								</div>
							)
						})}
					</div>


					{
						dateError
						&&
						<div className="alert alert-danger" role="alert">
							{dateError}
						</div>
					}
					{
						dayError
						&&
						<div className="alert alert-danger" role="alert">
							{dayError}
						</div>
					}
					{
						fetchErrors.map((error, index) => {
							console.log(error)
							console.log(`the error is: ${index}: ${error}`)
							return (
								<div key={index} className="alert alert-danger" role="alert">
									{error}
								</div>
							)
						})
					}

					{/* {Submit and Cancel buttons} */}
					<div style={{ width: "100%", height: 20, marginTop: 20 }}>
						<button type="button" className="btn btn-danger d-inline-block float-start"
							onClick={() => props.handleClose()}>Cancel</button>
						{
							isLoading ?
								<button className="btn btn-primary float-end" type="button" disabled>
									<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
									<span className="sr-only">Loading...</span>
								</button>
								:
								<button type="submit" className="btn btn-primary d-inline-block float-end">Add</button>
						}
					</div>
				</form>
			</div>
		</div >
	)
}

export default CrateAvailabilityForm
