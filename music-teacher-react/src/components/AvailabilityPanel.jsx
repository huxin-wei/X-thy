import React, { useState, useEffect, useRef } from 'react';
import CreateAvailabilityForm from './CreateAvailabilityForm';
import Availability from './Availability';
import { EatLoading } from 'react-loadingg'

const url = 'http://localhost:3001/api'

function AvailabilityPanel() {
	const [formMessage, setFormMessage] = useState({ success: false })
	const [availabilities, setAvailabilities] = useState([])
	const mountedRef = useRef(true)
	const [showForm, setShowForm] = useState(false)
	const [addSuccess, setAddSuccess] = useState(false)
	const [dummy, setDummy] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const signalAddSuccess = () => {
		setAddSuccess(true)
		setDummy(dummy + 1)
		setTimeout(() => {
			setAddSuccess(false)
		}, 2000)
	}

	function compare(a, b) {
		if (a.days < b.days) {
			return -1;
		}
		if (a.days > b.days) {
			return 1;
		}
		return 0;
	}

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!mountedRef.current) return null
		setIsLoading(true)
		setError('')
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			}
		}

		fetch(`${url}/availability/all`, requestOptions)
			.then(res => res.json())
			.then(res => {
				if (!mountedRef.current) return null
				if (!res.success) {
					throw new Error(res.message)
				}
				const avails = res.data
				avails.sort(compare)
				setAvailabilities(res.data)
				setError('')
				setIsLoading(false)
			})
			.catch(err => {
				if (!mountedRef.current) return null
				console.log(err.message)
				setError(err.message)
				setIsLoading(false)
			})


	}, [dummy])

	const removeAvailability = (id) => {
		setAvailabilities(availabilities.filter(availability => availability.availability_id != id))
	}

	return (
		<div className="mt-3">
			{/* {msg when successfully add new availability} */}
			{
				addSuccess &&
				<div className="alert alert-success" role="alert">
					Successfully added.
				</div>
			}

			{/* {Form component} */}
			{
				showForm ?
					<CreateAvailabilityForm signalAddSuccess={signalAddSuccess} handleClose={() => setShowForm(false)} />
					:
					<div>
						<button type="button" className="btn btn-primary mb-5" onClick={() => setShowForm(true)}>
							Add availability
						</button>
					</div>
			}

				{/* {LOADING && ERROR} */}
				{
					isLoading ? <EatLoading color="orange"/>
						: (error &&
							<div className="alert alert-danger" role="alert">
								{error}
							</div>
						)
				}

			{/* {Availability list} */}
				{
					availabilities.map(avail => {
						return (
							<Availability
								key={avail.availability_id}
								removeAvailability={removeAvailability}
								availability={avail}
							/>
						)

					})
				}
		</div>
	)
}

export default AvailabilityPanel
