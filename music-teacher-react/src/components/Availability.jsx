import React, { useState } from 'react'
import { TiEdit, TiTrash } from 'react-icons/ti'


function Availability(props) {
    const [availability, setAvailability] = useState(props.availability)

    const WEEK = [
        'Sun', 'Mon', 'Tu', 'Wed', 'Th', 'Fri', 'Sat'
    ]

    const minutesToHhMmAPmString = (minutes) => {
        let hours = Math.floor(minutes/60)
        const suffix = hours >= 12 ? "PM":"AM"
        let minutePart = ((minutes%60) + '0').substring(0,2)
        hours = `${((hours + 11) % 12 + 1)}:${minutePart} ${suffix}`
        return hours
    }

    const start_time = minutesToHhMmAPmString(availability.start_minute)
    const end_time = minutesToHhMmAPmString(availability.end_minute)

    return (
        <div>
            <div className="mb-2 pd-4">
                <div className="row">
                    <div className="col-0 col-sm-1  col-lg-2 col-xl-3"></div>
                    <div className="border-bottom mb-3 pb-2 col-12 col-sm-10 col-lg-8 col-xl-6">
                        <div className="ms-3 mb-2">
                            <p className="text-secondary">{availability.days}</p>
                            <p className="mb-1 text-secondary"><b>{start_time} - {end_time}</b></p>
                        </div>
                        <button type="button" title="edit" className="btn btn-secondary py-1">
                            <TiEdit size={20} />
                            <span className="align-middle" style={{ fontSize: 15 }}>EDIT</span>
                        </button>
                        <button type="button" title="delete" className="btn btn-danger py-1 float-end" >
                            <TiTrash size={20} />
                            <span className="align-middle" style={{ fontSize: 15 }}>DELETE</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Availability
