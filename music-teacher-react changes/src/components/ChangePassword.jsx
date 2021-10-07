import React, { useState, useRef, useEffect } from 'react'
import { API_URL } from '../JS/variables'

function ChangePassword() {
	const mountedRef = useRef(true)
	const [openPwdArea, setOpenPwdArea] = useState(false)
	const [currentPwd, setCurrentPwd] = useState('')
	const [newPwd, setNewPwd] = useState('')
	const [newPwdConfirm, setNewPwdConfirm] = useState('')
	const [success, setSuccess] = useState(false)
	const [errors, setErrors] = useState([])
	const [loading, setLoading] = useState(false)


	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	const resetFormState = () => {
		setCurrentPwd('')
		setNewPwd('')
		setNewPwdConfirm('')
	}

	const resetAllState = () => {
		resetFormState()
		setSuccess(false)
		setErrors([])
		setLoading(false)
	}

	const handleChangePassword = (e) => {
		e.preventDefault()
		console.log(`current: ${currentPwd}`)
		console.log(`pwd: ${newPwd}`)
		console.log(`confirm pwd: ${newPwdConfirm}`)
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				currentPwd: currentPwd,
				newPwd: newPwd,
				newPwdConfirm: newPwdConfirm
			}),
			credentials: 'include'
		}

		setSuccess(false)
		setErrors([])
		setLoading(true)

		fetch(`${API_URL}/api/auth/changepassword`, requestOptions)
			.then(res => res.json())
			.then(data => {
				if (!mountedRef.current) return null
				if (!data.success) {
					setErrors(data.message)
					setLoading(false)
					setSuccess(false)
					return
				}
				setLoading(false)
				setSuccess(true)
				setErrors([])
				resetFormState()
			})
			.catch(error => {
				if (!mountedRef.current) return null
				setErrors([error.message])
				setLoading(false)
				setSuccess(false)
			})
	}

	return (
		<div>
			<p><b>Password</b><span className="clickable" onClick={() => {
				setOpenPwdArea(!openPwdArea)

				// Reset state

			}}>change password</span></p>
			<div className="subform" style={{ display: openPwdArea ? 'block' : 'none' }}>
				<form onSubmit={handleChangePassword}>
					<div className="mb-3">
						<label htmlFor="currentPwd" className="form-label">CURRENT PASSWORD</label>
						<input className="form-control" type="password" name="currentPwd" id="currentPwd" value={currentPwd}
							onChange={(e) => setCurrentPwd(e.target.value)} required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="newPwd" className="form-label">NEW PASSWORD</label>
						<input className="form-control" type="password" name="newPwd" id="newPwd" value={newPwd}
							onChange={(e) => setNewPwd(e.target.value)} required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="newPwdConfirm" className="form-label">CONFIRM NEW PASSWORD</label>
						<input className="form-control" type="password" name="newPwdConfirm" id="newPwdConfirm" value={newPwdConfirm}
							onChange={(e) => setNewPwdConfirm(e.target.value)} required
						/>
					</div>

					{
						errors.map((err, index) => {
							return (
								<div key={index} className="alert alert-danger  show mt-3" role="alert">
									{err}
								</div>
							)
						})
					}

					{
						success &&
						<div className="alert alert-success  show mt-3" role="alert">
							Successfully changed password.
						</div>
					}
					{
						loading ?
							<div style={{ display: "flex", justifyContent: "flex-end" }}>
								<button className="btn btn-primary" type="button" disabled>
									<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
									<span className="sr-only"> DONE</span>
								</button>
							</div>
							:
							<div style={{ display: "flex", justifyContent: "flex-end" }}>
								<button className="btn btn-primary" type="submit">DONE</button>
							</div>
					}
				</form>
			</div>
		</div>
	)
}

export default ChangePassword
