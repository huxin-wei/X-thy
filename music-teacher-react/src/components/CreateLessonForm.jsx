import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables'
const MAX_DESCRIPTION_LENGTH = 500
const MAX_LESSON_NAME_LENGTH = 70

function CreateLessonForm(props) {
	const [lessonName, setLessonName] = useState('')
	const [description, setDescription] = useState('')
	const [price30m, setPrice30m] = useState('')
	const [price60m, setPrice60m] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const mountedRef = useRef(true)

	const onLessonNameChange = (e) => {
		let lessonName = e.target.value
		if (lessonName.length <= MAX_LESSON_NAME_LENGTH) {
			setLessonName(e.target.value)
		} else {
			e.target.value = lessonName
		}
	}

	const onDescriptionChange = (e) => {
		// auto adjust textarea height
		e.target.style.height = "";
		e.target.style.height = Math.min(e.target.scrollHeight, 300) + "px";

		let value = e.target.value

		if (value.length <= MAX_DESCRIPTION_LENGTH) {
			setDescription(value)
		}

		if (value.length > MAX_DESCRIPTION_LENGTH) {
			e.target.value = description
		}
	}

	const onPrice30mChange = (e) => {
		let value = e.target.value
		let isMoney = /^\d+\.{0,1}\d{0,2}$/.test(value)
		if (isMoney || value === '') {
			setPrice30m(value)
		} else {
			e.target.value = ''
		}
	}

	const onPrice60mChange = (e) => {
		let value = e.target.value
		let isMoney = /^\d+\.{0,1}\d{0,2}$/.test(value)
		if (isMoney || value === '') {
			setPrice60m(value)
		} else {
			e.target.value = ''
		}
	}

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	const handleAddNewLesson = (e) => {
		e.preventDefault()
		if(!mountedRef.current) return null
		setLoading(true)
		setError('')

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				lesson: lessonName,
				description: description,
				price30m: price30m,
				price60m: price60m
			}),
			credentials: 'include'
		}

		fetch(`${API_URL}/api/lesson/add`, requestOptions)
			.then(res => {
				if (!res.ok) {
					throw { message: `${res.status}: Cannot connect to the server.` }
				}
				return res
			})
			.then(res => res.json())
			.then((data) => {
				if(!mountedRef.current) return null
				if(!data.success){
					throw new Error(data.message)
				}
				props.handleClose()
				props.signalAddSuccess()
			})
			.catch((err) => {
				if(!mountedRef.current) return null
				console.log(err)
				setError(err.message)
				setLoading(false)
			})
	}

	console.log('Create lesson form re render')

	return (
		<div>
			<div className="mt-3 mb-3">
				<form onSubmit={handleAddNewLesson} className="form-default-box mw-600">
					<div className="mb-3">
						<label htmlFor="lessonName" className="form-label"><b>Lesson name</b> ({MAX_LESSON_NAME_LENGTH - lessonName.length} chars left)</label>
						<input onChange={onLessonNameChange} value={lessonName} type="text" className="form-control" id="lessonName" />
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label"><b>Description</b> ({MAX_DESCRIPTION_LENGTH - description.length} chars left)</label>
						<textarea onChange={onDescriptionChange} className="form-control" id="description" rows={5} wrap="soft" />
					</div>
					<div className="mb-3">
						<b>Price rates</b>
					</div>
					<div className="row g-2 mb-2">
						<div className="col-auto"><label htmlFor="price-30m" className="form-label">30 minutes</label></div>
						<div className="col-3">
							<input type="text"
								onChange={onPrice30mChange}
								value={price30m}
								maxLength="10"
								className="form-control" id="price-30m" />
						</div>
						<div className="col-auto">$</div>
					</div>
					<div className="row g-2 mb-2 ">
						<div className="col-auto "><label htmlFor="price-60m" className="form-label align-middle">60 minutes</label></div>
						<div className="col-3">
							<input type="text"
								onChange={onPrice60mChange}
								value={price60m}
								maxLength="10"
								className="form-control" id="price-60m" />
						</div>
						<div className="col-auto">$</div>
					</div>
					{
						error
						&&
						<div className="alert alert-danger" role="alert">
							{error}
						</div>
					}

					{/* {buttons panel} */}
					<div style={{ width: "100%", height: 30, margin: "25px auto 10px auto"}}>
						<button type="button" className="btn btn-danger d-inline-block float-start"
							onClick={() => props.handleClose()}>Cancel</button>
						{
							loading ?
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
		</div>
	)
}

export default CreateLessonForm
