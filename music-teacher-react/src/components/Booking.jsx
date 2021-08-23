import React, { useState, useEffect } from 'react'
import DatePicker from './DatePicker'
import TimeOffer from './TimeOffer'

const today = new Date()
const initDate = today.getDate()
const initMonth = today.getMonth() + 1
const initYear = today.getFullYear()
const INIT_FULLDATE = `${initYear}-${initMonth}-${initDate}`
console.log(INIT_FULLDATE, 'init full date')
const INIT_DURATION = 60

function Booking(props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [note, setNote] = useState('')
    const [duration, setDuration] = useState(INIT_DURATION)
    const [fullDate, setFullDate] = useState(INIT_FULLDATE)
    const [offeredTimes, setOfferedTimes] = useState([])

    console.log('in booking init full date is:' , INIT_FULLDATE)
    console.log(new Date(INIT_FULLDATE))
    console.log(fullDate, 'the fullDate is')

    const handleDateChange = (date, month, year) => {
        setFullDate(year + '-' + (month + 1) + '-' + date)
        console.log('this is run', year + '-' + (month+1) + '-' + date)
    }

    const onDurationChange = (e) => {
        setDuration(e.target.value)
    }

    return (
        <div>

            {/* {CLASS selection} */}
            <section>
                <div className="guide-banner mb-4">
                    <h3>Select class</h3>
                </div>

            </section>

            {/* {SESSION DURATION selection} */}
            <section>
                <div className="guide-banner my-4">
                    <h3>Select session duration</h3>
                </div>
                <div>
                    <div style={{ width: 200, margin: "20px auto" }}>
                        <select className="form-select" defaultValue={duration} aria-label="Default select example" onChange={onDurationChange}>
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                            <option value="150">150 minutes</option>
                            <option value="180">180 minutes</option>
                            <option value="210">210 minutes</option>
                            <option value="240">240 minutes</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* {DATE selection section} */}
            <section>
                <div className="guide-banner my-4">
                    <h3>Select date</h3>
                </div>
                <DatePicker date={initDate} month={initMonth - 1} year={initYear} onDateChange={handleDateChange}/>
            </section>

            {/* {TIME selection section} */}
            <section>
                <div className="guide-banner my-4">
                    <h3>Select time</h3>
                </div>
                <TimeOffer duration={duration} fullDate={fullDate} />
            </section>

            {/* ...... {student information} ......... */}
            <section>
                <div className="guide-banner my-4">
                    <h3>Your information</h3>
                </div>
                <div className="row">
                    <div className="col-0 col-sm-1 col-md-2 col-lg-2 col-xl-3 col-xxl-4"></div>
                    <form className="col-12 col-sm-10 col-md-8 col-lg-8 col-xl-6 col-xxl-4">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><b>Name</b> </label>
                            <input type="text" length={50} className="form-control" id="name" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label"><b>Email</b></label>
                            <input type="email" length={50} className="form-control" id="email" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label"><b>Phone</b></label>
                            <input type="tel" length={20} className="form-control" id="phone" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="note" className="form-label"><b>Note</b></label>
                            <textarea className="form-control" id="description" rows={5} wrap="soft" />
                        </div>
                    </form>
                </div>
            </section>

            {/* {summary table} */}
            <section>
                <div className="guide-banner my-4">
                    <h3>Confirm details & Book appointment</h3>
                </div>
                <table className="table mb-4" style={{ margin: "auto", maxWidth: 600 }}>
                    <tbody>
                        <tr className="table-primary">
                            <td colSpan="2">
                                <b>Your information</b>
                            </td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Name</td>
                            <td>name</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Email</td>
                            <td>email</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Phone</td>
                            <td>phone</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag" style={{ verticalAlign: "top" }}>Note</td>
                            <td>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti tenetur alias voluptate veniam. Pariatur dignissimos magni nulla, omnis necessitatibus reprehenderit culpa enim perspiciatis mollitia illo distinctio, autem sint sunt repellat!</td>
                        </tr>
                        <tr className="table-primary">
                            <td colSpan="2"><b>Appointment information</b></td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Class</td>
                            <td>class name</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Class ID</td>
                            <td>class id</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Date</td>
                            <td>date + time</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Duration</td>
                            <td>duration</td>
                        </tr>
                        <tr className="table-light">
                            <td className="booking-info-tag">Fee</td>
                            <td>fee (pay at the study date)</td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ borderBottom: "none" }}>
                                <button className="btn btn-primary float-end mt-3">
                                    BOOK APPOINTMENT
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export default Booking
//handleDateChange={handleDateChange}