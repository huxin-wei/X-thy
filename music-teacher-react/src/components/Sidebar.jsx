import React, {useContext} from 'react'
import { Link, Router, NavLink } from 'react-router-dom'
import { GiSpellBook, GiTeacher, GiBookmark } from "react-icons/gi";
import {GoCalendar} from "react-icons/go"
import { ImUpload2 } from 'react-icons/im'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import Cookies from 'js-cookie'
import {AppContext} from './AppContext'

const url = 'http://localhost:3001'

function Sidebar() {
    const {setUser} = useContext(AppContext)
    const size = 25

    const logout = () => {
        const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
            credentials: 'include'
            
		}
        fetch(`${url}/api/auth/logout`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if(!data.success){
                    throw new Error(data.message)
                }
                Cookies.remove('loggedIn')
                Cookies.remove('email')
                setUser(null)
            })
            .catch(error => {
                console.log(error.message)
                setUser(null)
            })
    }
    return (
        <div className="sidebar-wrapper" >
            <div className="sidebar-upper-wrapper">
                <ul>
                    <li data-toggle="tooltip" data-placement="right" title="calendar">
                        <NavLink
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/calendar">
                            <GoCalendar size={size} />
                            <p>Calendar</p>
                        </NavLink>
                    </li>
                    <li data-toggle="tooltip" data-placement="right" title="manage guitar lessons">
                        <NavLink
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/lesson">
                            <GiSpellBook size={size} />
                            <p>Lesson</p>

                        </NavLink>
                    </li>
                    <li data-toggle="tooltip" data-placement="right" title="manage my availability">
                        <NavLink
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/availability">
                            <GiTeacher size={size} />
                            <p>Availability</p>

                        </NavLink>
                    </li>
                    <li data-toggle="tooltip" data-placement="right" title="book an appointment">
                        <NavLink
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/booking">
                            <GiBookmark size={size} />
                            <p>Book appointment</p>

                        </NavLink>
                    </li>
                    <li data-toggle="tooltip" data-placement="right" title="upload files">
                        <NavLink
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/upload">
                            <ImUpload2 size={size} />
                            <p>Upload</p>

                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="sidebar-bottom-wrapper">
                <ul>
                    <li data-toggle="tooltip" data-placement="right" title="log out">
                        <NavLink
                            className="sidebar-link"
                            to="/" onClick={() => {
                                logout()
                            }}>
                            <RiLogoutBoxRLine size={size} />
                            <p>Logout</p>

                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
