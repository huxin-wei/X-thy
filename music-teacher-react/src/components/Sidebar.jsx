import React from 'react'
import { Link, Router, NavLink } from 'react-router-dom'
import { GiGuitar, GiSpellBook, GiTeacher } from "react-icons/gi";
import { ImUpload2 } from 'react-icons/im'
import { RiLogoutBoxRLine } from 'react-icons/ri'

function Sidebar() {
    const size = 25
    return (
        <div className="sidebar-wrapper" >
            <div className="sidebar-upper-wrapper">
                <ul>
                    <li data-toggle="tooltip" data-placement="right" title="my appointments">
                        <NavLink
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/appointment">
                            <GiGuitar size={size} />
                            <p>Appointments</p>
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
                            activeClassName="sidebar-link--active"
                            className="sidebar-link"
                            to="/logout">
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
