import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../JS/variables'
import ChangePassword from './ChangePassword'

function AccountSettingPanel() {
    const mountedRef = useRef(true)
    const [email, setEmail] = useState('')
    const [dummy, setDummy] = useState(0)

    const [openEmailArea, setOpenEmailArea] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [pwdForEmailChanging, setPwdForEmailChanging] = useState('')
    const [eStep1Success, setEStep1Success] = useState('')
    const [eStep1Error, setEStep1Error] = useState('')
    const [eStep1Loading, setEStep1Loading] = useState(false)

    const [code, setCode] = useState('')
    const [eStep2Loading, setEStep2Loading] = useState(false)
    const [eStep2Error, setEStep2Error] = useState('')

    useEffect(() => {
        return () => {
            mountedRef.current = false
        }
    }, [])

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        }
        fetch(`${API_URL}/api/auth/userinfo`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (!mountedRef.current) return null
                if (!data.success) {
                    throw new Error(data.message)
                }
                setEmail(data.email)
            })
            .catch(error => {

            })
    }, [dummy])

    const resetEState = () => {
        setNewEmail('')
        setPwdForEmailChanging('')
        setEStep1Success('')
        setEStep1Error('')
        setEStep1Loading(false)

        setCode('')
        setEStep2Loading(false)
        setEStep2Error('')
    }

    const handleRequestCode = (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                currentEmail: email,
                newEmail: newEmail,
                password: pwdForEmailChanging
            }),
            credentials: 'include'
        }

        setEStep1Loading(true)
        setEStep1Error('')
        setEStep1Success('')

        fetch(`${API_URL}/api/auth/changeemail/code`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (!mountedRef.current) return null
                if (!data.success) {
                    throw new Error(data.message)
                }
                setEStep1Loading(false)
                setEStep1Success(data.message)
            })
            .catch(error => {
                console.log(error)
                if (!mountedRef.current) return null
                setEStep1Loading(false)
                setEStep1Error(error.message)
                setEStep1Success('')
            })
    }

    const handleChangeEmail = (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                code: code
            }),
            credentials: 'include'
        }

        setEStep2Loading(true)
        setEStep2Error('')
        fetch(`${API_URL}/api/auth/changeemail/change`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (!mountedRef.current) return null
                if (!data.success) {
                    throw new Error(data.message)
                }
                resetEState()
                setOpenEmailArea(false)
                setDummy(dummy + 1)
            })
            .catch(error => {
                console.log('in error')
                if (!mountedRef.current) return null
                console.log(error)
                setEStep2Loading(false)
                setEStep2Error(error.message)

            })
    }

    return (
        <div className="account-setting">
            <div className="mb-3 pb-3 bottom-border">
                <p><b>Email</b><span>{email}</span><span className="clickable" onClick={() => {
                    setOpenEmailArea(!openEmailArea)
                    resetEState()
                }}>change email</span></p>
                {
                    openEmailArea &&
                    <div className="subform">
                        <form onSubmit={handleRequestCode}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">NEW EMAIL</label>
                                <input className="form-control" type="email" name="email" id="email"
                                    onChange={(e) => setNewEmail(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">CURRENT PASSWORD</label>
                                <input className="form-control" type="password" name="password" id="password"
                                    onChange={(e) => setPwdForEmailChanging(e.target.value)} required
                                />
                            </div>

                            {eStep1Error &&
                                <div className="alert alert-danger  show mt-3" role="alert">
                                    {eStep1Error}
                                </div>
                            }
                            {
                                eStep1Success &&
                                <div className="alert alert-success  show mt-3" role="alert">
                                    {eStep1Success}
                                </div>
                            }
                            {
                                eStep1Loading ?
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="sr-only">SEND PASSCODE TO NEW EMAIL.</span>
                                        </button>
                                    </div>
                                    :
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="btn btn-primary" type="submit" >SEND PASSCODE TO NEW EMAIL</button>
                                    </div>
                            }
                        </form>

                        {/* {form to change email with code} */}
                        {
                            eStep1Success &&
                            <div className="mt-3">
                                <form onSubmit={handleChangeEmail}>
                                    <div className="mb-3">
                                        <label htmlFor="code" className="form-label">CODE</label>
                                        <input className="form-control" type="text" name="code" id="code"
                                            onChange={(e) => setCode(e.target.value)} required
                                        />
                                    </div>

                                    {
                                        eStep2Error &&
                                        <div className="alert alert-danger  show mt-3" role="alert">
                                            {eStep2Error}
                                        </div>

                                    }
                                    {
                                        eStep2Loading ?
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <button className="btn btn-primary" type="submit" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="sr-only">DONE</span>
                                                </button>
                                            </div>
                                            :
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <button className="btn btn-primary" type="submit">DONE</button>
                                            </div>
                                    }
                                </form>
                            </div>
                        }
                    </div>
                }
            </div>

            <ChangePassword />
        </div>
    )
}

export default AccountSettingPanel
