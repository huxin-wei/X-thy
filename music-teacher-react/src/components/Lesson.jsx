import React, { useState, useEffect, useRef } from 'react'
import { TiTrash } from 'react-icons/ti'
import { API_URL } from '../JS/variables'

const url = 'http://localhost:3001'

function Lesson({ lessonId, lessonName, description, price30m, price60m, removeLesson }) {
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const mountedRef = useRef(true)

	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])
	
	const deleteLesson = () => {
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

		fetch(`${API_URL}/api/lesson/delete/${lessonId}`, requestionOptions)
			.then(res => res.json())
			.then(data => {
				if (!data.success) {
					throw new Error(data.message)
				}
				if (!mountedRef.current) return null
				setIsLoading(false)
				setError('')
				removeLesson(lessonId)
			})
			.catch(error => {
				if (!mountedRef.current) return null
				setIsLoading(false)
				setError(error.message)
			})
	}

	return (
		<div className="mb-2 pd-4">
			<div className="default-wrapper mw-600">
				<h1 className="web-main-color">{lessonName}</h1>
				<div className="ms-3 mb-2">
					<p className="text-secondary">{description}</p>
					<p className="mb-1 text-secondary"><b>Fee rates</b></p>
					<p className="mb-1 text-secondary">30 minutes: <b>${price30m}</b></p>
					<p className="mb-1 text-secondary">60 minutes: <b>${price60m}</b></p>
				</div>
				{/* <button type="button" title="edit" className="btn btn-secondary py-1">
                        <TiEdit size={20} />
                        <span className="align-middle" style={{ fontSize: 15 }}>EDIT</span>
                    </button> */}
				{error &&
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				}

				<div style={{ height: 30 }}>
					{
						isLoading ?
							<button className="btn btn-danger py-1 float-end" type="button" disabled>
								<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
								<span className="sr-only">Deleting...</span>
							</button>
							:
							<button onClick={deleteLesson} type="button" title="delete" className="btn btn-danger py-1 float-end" >
								<TiTrash size={20} />
								<span className="align-middle button-text" style={{ fontSize: 12 }}>DELETE</span>
							</button>
					}
				</div>
			</div>
		</div>
	)
}

export default Lesson
