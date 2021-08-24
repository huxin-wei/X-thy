import React, { useState, useEffect } from 'react';
import CreateAvailabilityForm from './CreateAvailabilityForm';
import Availability from './Availability';

const url = 'http://localhost:3001/api'

function AvailabilityPanel() {
    const [formMessage, setFormMessage] = useState({ success: false })
    const [availabilities, setAvailabilities] = useState([])
    const [fetchError, setFetchError] = useState('')

    const sendMessageToParent = (obj) => {
        setFormMessage(obj)
        setTimeout(() => {
            setFormMessage({ success: false })
        }, 2000)
    }

    function compare(a, b) {
        if (a.days < b.days) {
            return -1;
        }
        if (a.days > b.days) {
            return 1;
        }
        return 0;
    }

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }

        fetch(`${url}/availability`, requestOptions)
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message)
                }
                const avails = res.data
                avails.sort(compare)
                setAvailabilities(res.data)
                setFetchError('')
            })
            .catch(err => {
                console.log(err.message)
                setFetchError(err.message)
            })

    }, [])

    return (
        <div>
            {/* {Message when Successfully added} */}
            {formMessage.success &&
                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    <strong>{formMessage.message}</strong>
                    <button type="button" className="btn-close" onClick={() => setFormMessage({ success: false })}></button>
                </div>
            }

            {/* {Form component} */}
            <CreateAvailabilityForm sendMessageToParent={sendMessageToParent} />

            {fetchError &&
                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    <strong>{fetchError}</strong>
                    <button type="button" className="btn-close" onClick={() => setFormMessage({ success: false })}></button>
                </div>
            }

            {/* {Availability list} */}
            <div className="pt-5 ps-3 pe-3">
                {
                    availabilities.map(avail => {
                        return (
                            <Availability
                                key={avail.availability_id}
                                availability={avail}
                            />
                        )

                    })
                }
            </div>
        </div>
    )
}

export default AvailabilityPanel
