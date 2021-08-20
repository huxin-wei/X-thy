import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

const MONTH = [
    { value: 0, month: 'JAN' },
    { value: 1, month: 'FEB' },
    { value: 2, month: 'MAR' },
    { value: 3, month: 'APR' },
    { value: 4, month: 'MAY' },
    { value: 5, month: 'JUN' },
    { value: 6, month: 'JUL' },
    { value: 7, month: 'AUG' },
    { value: 8, month: 'SEP' },
    { value: 9, month: 'OCT' },
    { value: 10, month: 'NOV' },
    { value: 11, month: 'DEC' },
]

const WEEK = [
    'Sun', 'M', 'T', 'W', 'TH', 'F', 'S'
]

function DatePicker(props) {
    const [date, setDate] = useState(props.date)
    const [month, setMonth] = useState(props.month)
    const [year, setYear] = useState(props.year)
    const [selectedMonth, setSelectedMonth] = useState(props.month)
    const [selectedYear, setSelectedYear] = useState(props.year)
    const [fullDateStr, setFullDateStr] = useState('')
    const [dates, setDates] = useState([])
    // const handleDateChange = props.handleDateChange

    useEffect(() => {
        resetCalendar()
    }, [month, year])

    const resetCalendar = () => {
        let newDates = []
        let today = new Date()
        let startDayOfMonth = new Date(year, month, 1)
        let dayOfMonthAtStart = startDayOfMonth.getDay()
        let endDayOfMonth = new Date(year, month + 1, 0)
        let numDayOfMonth = endDayOfMonth.getDate()

        let numObj = numDayOfMonth + dayOfMonthAtStart

        let currentDate = 1 - dayOfMonthAtStart
        for (let i = 0; i < numObj; i++) {
            let theDate = new Date(year, month, currentDate)
            let upComming = currentDate > 0 && (checkFutureDay(theDate, today) || checkSameDay(theDate, today))

            let obj = {
                id: currentDate,
                upComming: upComming
            }
            newDates.push(obj)
            currentDate++
        }
        setDates(newDates)
    }

    const checkSameDay = (date1, date2) => {
        return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear()
    }

    const checkFutureDay = (date, thresholdDate) => {
        return date > thresholdDate
    }

    const incrementYear = () => {
        setYear(year + 1)
    }

    const decrementYear = () => {
        if (year > 1970) {
            setYear(year - 1)
        }
    }

    const monthHandle = (e) => {
        setMonth(parseInt(e.target.id))
        console.log('month', e.target.id)
    }

    const onSelectDateHandle = (e) => {
        setSelectedMonth(month)
        setSelectedYear(year)
        setDate(parseInt(e.target.id))
    }

    return (
        <div>
            <div className="calendar-picker">
                    <div style={{display: "flex", margin: "10px 3px", borderBottom: "2px solid #f2f2f2"}}>
                        <h3 style={{margin: "auto", fontSize: 25}}>
                            {`${date} ${MONTH[selectedMonth].month} ${selectedYear}`}
                        </h3>
                    </div>

                <div className="year-spinner">
                    <button onClick={decrementYear} className="float-start" >
                        <FaAngleLeft size={25} />
                    </button>
                    <span style={{ fontSize: 20 }}>{year}</span>
                    <button onClick={incrementYear} className="float-end">
                        <FaAngleRight size={25} />
                    </button>
                </div>
                <div className="month-picker py-2">
                    <div className="month-grid">
                        {
                            MONTH.map(monthObj => {
                                return (
                                    <div key={monthObj.value} className={`${parseInt(monthObj.value) == parseInt(month) ? 'month-item-active' : ''} month-item `}>
                                        <button id={monthObj.value} onClick={monthHandle}>
                                            {monthObj.month}
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="date-grid py-2">
                    {
                        WEEK.map((aDay, index) => {
                            return (
                                <div className="date-item date-item-header" key={index} >
                                    <div style={{ margin: "auto" }}>
                                        {aDay}
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        dates.map(aDate => {
                            let upcommingCSS = aDate.upComming ? 'date-item-upcomming' : ''
                            let currentCSS = aDate.id == date && month == selectedMonth && year == selectedYear ? 'date-item-active' : ''

                            return (
                                <div className={`date-item ${upcommingCSS} ${currentCSS}`} key={aDate.id}>
                                    <button disabled={!aDate.upComming ? true : false} onClick={onSelectDateHandle} id={aDate.id}>
                                        <div id={aDate.id}>
                                            <p id={aDate.id}>{aDate.id > 0 && aDate.id}</p>
                                        </div>
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DatePicker

{/* <div className="date-item">
<div style={{ margin: "auto" }}>
    1
</div>
</div>
<div className="date-item">&nbsp;</div>
<div className="date-item date-item-past">
<button disabled>
    <div>
        <p>3</p>
    </div>
</button>
</div>
<div className="date-item date-item-active date-item-upcomming">
<button>
    <div>
        <p>4</p>
    </div>
</button>
</div>
<div className="date-item date-item-upcomming">
<button>
    <div>
        <p>5</p>
    </div>
</button>
</div> */}