import React, { useState, useEffect } from 'react'

const url = 'http://localhost:3001'

function TimeOffer(props) {
    const [fetchErrors, setFetchErrors] = useState([])
    const [times, setTimes] = useState([])


    // UTC TIME
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }

        const date = new Date(props.fullDate)
        let day = date.getDay()
        let utcTimeStr = date.toUTCString()

        fetch(`${url}/availability/offertime?day=${day}&duration=${props.duration}&utcDate=${utcTimeStr}`, requestOptions)
            .then(res => res.json())
            .then((data) => {
                if (!data.success) {
                    console.log(data)
                    throw new Error(data.message)
                }
                if (data.times.length === 0) {
                    throw new Error("I'm not available today. Check another day.")
                }
                console.log(data)
                setFetchErrors([])
                setTimes(data.times)
            })
            .catch((err) => {
                setTimes([])
                if (Array.isArray(err)) {
                    setFetchErrors(err)
                    console.log('it is array')
                }
                else {
                    setFetchErrors([err.message])
                    console.log('err is not array')
                }
                console.log(err)
            })
    }, [props.fullDate, props.duration])

    const minutesToHHMM = (minutes) => {
        let hours = Math.floor(minutes/60)
        const suffix = hours >= 12 ? "PM":"AM"
        let minutePart = ((minutes%60) + '0').substring(0,2)
        hours = `${((hours + 11) % 12 + 1)}:${minutePart} ${suffix}`
        return hours
    }
    return (
        <div>
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
            {
                times.map(time => {

                    return(
                        <button type="button" className="btn btn-primary mx-2 my-2" style={{width: 100}}>{minutesToHHMM(time)}</button>
                    )
                })

            }
        </div>
    )
}

export default TimeOffer
