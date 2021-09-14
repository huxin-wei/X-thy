import React, { useState, useEffect, useContext } from 'react'
import {AppContext} from './AppContext'
import Cookies from 'js-cookie'
import { API_URL } from '../JS/variables'

function Login() {
    const {user, setUser} = useContext(AppContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')


    useEffect(() => {
        document.body.style = "background: #f29a04"

        return () => {
            document.body.style = { background: "#eee" }  //whenever the component removes it will executes
        }
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
                if(!data.success){
                    throw new Error(data.message)
                }
                Cookies.set('loggedIn', true)
                Cookies.set('email', data.email)
                console.log(document.cookie)
                setUser({loggedIn: true})
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
                setError(error.message)
            })
    }

    return (
        <div >
            <div className="box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="inputBox">
                        <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                        <label htmlFor="email">Username</label>
                    </div>
                    <div className="inputBox">
                        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                        <label htmlFor="password">password</label>
                    </div>

                    {error &&
                        <div className="alert alert-danger  show mt-3" role="alert">
                            {error}
                        </div>
                    }
                    {
                        isLoading ?
                            <button className="btn btn-primary float-end" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only">Loading...</span>
                            </button>
                            :
                            <button type="submit" className="btn btn-primary d-inline-block float-end">Submit</button>
                    }

                </form>


            </div>
        </div>
    )
}

export default Login
