import React, { useState } from 'react'

const MAX_DESCRIPTION_LENGTH = 500
const MAX_LESSON_NAME_LENGTH = 70
const url = 'http://localhost:3001'



const EVERYDAY_INDEX = 7


function CrateAvailabilityForm(props) {
    const DAYS = [
        { id: 0, day: 'Sun', isChecked: false },
        { id: 1, day: 'Mon', isChecked: false },
        { id: 2, day: 'Tu', isChecked: false },
        { id: 3, day: 'Wed', isChecked: false },
        { id: 4, day: 'Th', isChecked: false },
        { id: 5, day: 'Fri', isChecked: false },
        { id: 6, day: 'Sat', isChecked: false },
        { id: 7, day: 'Everyday', isChecked: false },
    ]
    const [showAddAvailability, setShowAddAvailability] = useState(false)
    const [timeFrom, setTimeFrom] = useState('')
    const [timeTo, setTimeTo] = useState('')
    const [selectedDays, setSelectedDays] = useState(DAYS)
    const [loading, setLoading] = useState(false)
    const [fetchErrors, setFetchErrors] = useState([])
    const [dateError, setDateError] = useState('')
    const [dayError, setDayError] = useState('')
    const sendMessageToParent = props.sendMessageToParent

    const handleAddAvailability = (e) => {
        e.preventDefault()
        setLoading(true)
        setFetchErrors([])

        const days = getSelectedDaysValue()

        if (!days) {
            setDayError('At least one day must be selected.')
            setLoading(false)
            return
        } else{
            setDayError('')
        }

        console.log(days)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                timeFrom: timeFrom,
                timeTo: timeTo,
                days: getSelectedDaysValue()
            })
        }

        fetch(`${url}/availability`, requestOptions)
            .then(res => {
                if (!res.ok) {
                    throw { message: `${res.status}: Cannot connect to the server.` }
                }
                return res
            })
            .then(res => res.json())
            .then((data) => {
                if (!data.success) {
                    console.log('............')
                    console.log(data.message)
                    throw data.message
                }
                setFetchErrors([])
                setLoading(false)
                setShowAddAvailability(false)
                setTimeFrom('')
                setTimeTo('')
                setSelectedDays(DAYS)
                setDateError('')
                setDayError('')
                sendMessageToParent({
                    success: true,
                    message: 'Successfully created availability.'
                })
            })
            .catch((err) => {
                if (Array.isArray(err)){
                    setFetchErrors(err)
                }
                else {
                    setFetchErrors([err.message])
                }
                setLoading(false)
            })
    }

    console.log('Create availability form re render')

    // return 056 if Sun, Fri, Sat is checked
    const getSelectedDaysValue = () => {
        let val = ''
        selectedDays.map(day => {
            if (day.id == EVERYDAY_INDEX) {return}
            if (day.isChecked) {
                val += day.id
            }
        })
        return val
    }

    const onTimeFromChange = (e) => {
        let time = destructHHMM(e.target.value)

        if (timeTo == '' || time < timeTo) {
            setTimeFrom(time)
            if (dateError) {
                setDateError('')
            }
        } else {
            e.target.value = ''
            setDateError('Must be lesser.')
        }
    }

    const onTimeToChange = (e) => {
        let time = destructHHMM(e.target.value)

        if (timeFrom == '' || time > timeFrom) {
            setTimeTo(time)
            if (dateError) {
                setDateError('')
            }
        } else {
            e.target.value = ''
            setDateError('Must be greater.')
        }
    }

    const destructHHMM = (hhmmStr) => {
        let list = hhmmStr.split(':')
        return list[0] * 60 + list[1] * 1
    }

    const onSelectedDayChange = (e) => {
        setSelectedDays(selectedDays.map(day => {
            if (e.target.id == 7) {
                selectedDays.map(d => {
                    d.isChecked = e.target.checked
                })
            } else {
                if (e.target.id == day.id) {
                    day.isChecked = e.target.checked
                    selectedDays[7].isChecked = false
                }
            }

            return {
                ...day
            }
        }))
        console.log(selectedDays)
    }

    return (
        <div>
            {
                showAddAvailability ?
                    <div className="mt-3 mb-3">
                        <div className="row">
                            <form onSubmit={handleAddAvailability} style={{ margin: "auto", width: 320 }}>

                                {/* {TIME INPUTS} */}
                                <div className="py-1">
                                    <span style={{ width: 50, display: "inline-block" }}><b>From</b></span>
                                    <input style={{ display: "inline-block" }} type="time" onChange={onTimeFromChange} required />
                                </div>
                                <div className="py-1">
                                    <div style={{ width: 50, display: "inline-block" }}><span><b>To</b></span></div>
                                    <input style={{ display: "inline-block" }} type="time" onChange={onTimeToChange} required />
                                </div>

                                <div className="form-check">
                                    {selectedDays.map((day) => {
                                        return (
                                            <div key={day.id}>
                                                <input className="form-check-input" type="checkbox" id={day.id} onChange={onSelectedDayChange} checked={day.isChecked} />
                                                <label className="form-check-label" htmlFor={day.id}>{day.day}</label>
                                            </div>
                                        )
                                    })}
                                </div>


                                {
                                    dateError
                                    &&
                                    <div className="alert alert-danger" role="alert">
                                        {dateError}
                                    </div>
                                }
                                {
                                    dayError
                                    &&
                                    <div className="alert alert-danger" role="alert">
                                        {dayError}
                                    </div>
                                }
                                {
                                    fetchErrors.map((error, index) => {
                                        console.log(`the error is: ${index}: ${error}`)
                                        return (
                                            <div key={index} className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )
                                    })
                                }




                                {/* {Submit and Cancel buttons} */}
                                <div style={{ width: "100%" }}>
                                    <button type="button" className="btn btn-danger d-inline-block float-start"
                                        onClick={() => setShowAddAvailability(false)}>Cancel</button>
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
                    :
                    <div>
                        <button type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setShowAddAvailability(true)
                            }}>
                            Add availability
                        </button>
                    </div>
            }
        </div>
    )
}

export default CrateAvailabilityForm
