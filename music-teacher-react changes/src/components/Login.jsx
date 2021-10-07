import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import Cookies from 'js-cookie'
import { API_URL } from '../JS/variables'

function Login() {
    const { setUser } = useContext(AppContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [forgotPassword, setForgotPassword] = useState(false)
    const [requestCodeLoading, setRequestCodeLoading] = useState(false)
    const [requestCodeError, setRequestCodeError] = useState('')
    const [codeRequestSuccess, setCodeRequestSuccess] = useState(false)

    const [newPwd, setNewPwd] = useState('')
    const [newPwdConfirm, setNewPwdConfirm] = useState('')
    const [code, setCode] = useState('')
    const [newPwdErrors, setNewPwdErrors] = useState([])
    const [newPwdLoading, setNewPwdLoading] = useState(false)
    const [newPwdSuccess, setNewPwdSuccess] = useState(false)


    useEffect(() => {
        // document.body.style = "background: #f29a04"

        // return () => {
        //     document.body.style = { background: "#eee" }  //whenever the component removes it will executes
        // }
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include'
        }
        setIsLoading(true)
        setError(false)

        fetch(`${API_URL}/api/auth/login`, requestOptions)
            .then((res) => {
                console.log(res)

                return res
            })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(data.message)
                }
                Cookies.set('loggedIn', true)
                setUser({ loggedIn: true })
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
                setError(error.message)
            })
    }

    const handleRequestResetPwdCode = () => {
        if (!email) {
            setRequestCodeError('Require your login email.')
            return
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        }

        setRequestCodeError('')
        setRequestCodeLoading(true)
        setCodeRequestSuccess(false)

        fetch(`${API_URL}/api/auth/requestresetpasswordcode`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(data.message)
                }
                setRequestCodeError('')
                setRequestCodeLoading(false)
                setCodeRequestSuccess(true)
            })
            .catch(error => {
                console.log(error)
                setRequestCodeError(error.message)
                setRequestCodeLoading(false)
            })
    }

    const validatePassword = (password) => {
        const pwdError = []
        if (password.length < 8) {
            pwdError.push('Password length must be atleast 8 characters.')
        } else if (password.length > 20) {
            pwdError.push('Password length must not exceed 20 characters.')
        }

        let re = /(?=.*[a-z])/
        if (!re.test(password)) {
            pwdError.push('Password must contain atleast 1 lowercase alphabetical character')
        }

        re = /(?=.*[A-Z])/
        if (!re.test(password)) {
            pwdError.push('Password must contain at least 1 uppercase alphabetical character')
        }

        re = /(?=.*[0-9])/
        if (!re.test(password)) {
            pwdError.push('Password must contain at least 1 numeric character')
        }

        return pwdError

    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        const inputErrors = validatePassword(newPwd)
        if (newPwd !== newPwdConfirm) {
            inputErrors.push('Passwords do not match.')
        }

        if (inputErrors.length) {
            setNewPwdErrors(inputErrors)
            return
        }

        //fetch
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                pwd: newPwd,
                pwdConfirm: newPwdConfirm,
                code: code
            })
        }

        setNewPwdErrors([])
        setNewPwdLoading(true)
        setNewPwdSuccess(false)

        fetch(`${API_URL}/api/auth/resetpasswordbycode`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (!data.success) {
                    if (Array.isArray(data.message)) {
                        setNewPwdErrors(data.message)
                    } else {
                        setNewPwdErrors([data.message])
                    }
                    setNewPwdLoading(false)
                    setNewPwdSuccess(false)
                    return
                }
                setNewPwdErrors([])
                setNewPwdLoading(false)
                setNewPwdSuccess(true)
            })
            .catch(error => {
                console.log(error)
                setNewPwdErrors([error.message])
                setNewPwdLoading(false)
                setNewPwdSuccess(false)
            })
    }

    return (
        <div >
            <div className="row">
                <div className="col-0 col-md-3 col-xl-4"></div>
                <div className="col-12 col-md-6 col-xl-4 mt-5 px-0" style={{ border: "1px solid rgb(224, 224, 224)" }}>
                    <div >
                        <form
                            onSubmit={handleLogin}>
                            <div style={{ margin: 20 }}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input className="form-control" type="email" name="email" id="email"
                                        onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input className="form-control" type="password" name="password" id="password"
                                        onChange={(e) => setPassword(e.target.value)} required
                                    />
                                </div>

                                {error &&
                                    <div className="alert alert-danger  show mt-3" role="alert">
                                        {error}
                                    </div>
                                }
                                {
                                    isLoading ?
                                        <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="sr-only">Loading...</span>
                                        </button>
                                        :
                                        <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Login</button>
                                }
                            </div>
                        </form>

                        {/* {forgot password} */}
                        <div className="px-3" style={{ background: "rgb(238, 238, 238)" }}>
                            <div className="mt-4" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 15, height: 50 }}>
                                <p style={{ color: "rgb(88, 88, 88)", textDecoration: "underline" }} onClick={() => setForgotPassword(true)}>forgot password?</p>
                            </div>
                            {
                                forgotPassword &&
                                <div style={{ padding: 10 }}>
                                    <p>Type email in the field above then submit. We will send reset password code to your email.</p>

                                    {requestCodeError &&
                                        <div className="alert alert-danger  show mt-3" role="alert">
                                            {requestCodeError}
                                        </div>
                                    }
                                    {
                                        codeRequestSuccess &&
                                        <div className="alert alert-success  show mt-3" role="alert">
                                            Reset password code has been sent to your email. Use that code to reset password.
                                        </div>
                                    }
                                    {
                                        requestCodeLoading ?
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <button className="btn btn-warning" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="sr-only"> send code</span>
                                                </button>
                                            </div>
                                            :
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <button className="btn btn-warning" type="button" onClick={() => handleRequestResetPwdCode()}>send code</button>
                                            </div>
                                    }

                                    {/* {form to reset password} */}
                                    {
                                        codeRequestSuccess &&
                                        <div>
                                            <form onSubmit={handleChangePassword}>
                                                <div className="mb-3">
                                                    <label htmlFor="pwd1" className="form-label">new password</label>
                                                    <input className="form-control" type="password" name="pwd1" id="pwd1"
                                                        onChange={(e) => setNewPwd(e.target.value)} required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="pwd2" className="form-label">confirm password</label>
                                                    <input className="form-control" type="password" name="pwd2" id="pwd2"
                                                        onChange={(e) => setNewPwdConfirm(e.target.value)} required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="code" className="form-label">code</label>
                                                    <input className="form-control" type="text" name="code" id="code"
                                                        onChange={(e) => setCode(e.target.value)} required
                                                    />
                                                </div>

                                                {newPwdErrors &&
                                                    newPwdErrors.map((err, index) => {
                                                        return (
                                                            <div key={index} className="alert alert-danger  show mt-3" role="alert">
                                                                {err}
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    newPwdSuccess &&
                                                    <div className="alert alert-success  show mt-3" role="alert">
                                                        Successful. You can now login with the new password.
                                                    </div>
                                                }
                                                {
                                                    newPwdLoading ?
                                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            <button className="btn btn-primary" type="button" disabled>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"> change password</span>
                                                            </button>
                                                        </div>
                                                        :
                                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            <button className="btn btn-primary" type="submit">change password</button>
                                                        </div>
                                                }
                                            </form>
                                        </div>
                                    }

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login