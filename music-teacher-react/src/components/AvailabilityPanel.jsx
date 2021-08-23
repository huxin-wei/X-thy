import React, { useState, useEffect } from 'react'
import CreateAvailabilityForm from './CreateAvailabilityForm'

function AvailabilityPanel() {
    const [formMessage, setFormMessage] = useState({ success: false })

    const sendMessageToParent = (obj) => {
        setFormMessage(obj)
        setTimeout(() => {
            setFormMessage({success: false})
        }, 2000)
    }

    return (
        <div>

            {/* {Message when Successfully added} */}
            {formMessage.success &&
                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    <strong>{formMessage.message}</strong>
                    <button type="button" className="btn-close" onClick={() => setFormMessage({success: false})}></button>
                </div>
            }

            {/* {Form component} */}
            <CreateAvailabilityForm sendMessageToParent={sendMessageToParent} />
        </div>
    )
}

export default AvailabilityPanel
