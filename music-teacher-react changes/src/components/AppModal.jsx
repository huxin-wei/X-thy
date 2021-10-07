import React, { useEffect} from 'react'

function AppModal({show, onClose, title, children}) {

    useEffect(() => {
        const closeOnEscapeKeyDown = (e) => {
            if( e.keyCode === 27) {
                onClose()
            } 
        }
        document.addEventListener('keydown', closeOnEscapeKeyDown)
        return () => {
            document.removeEventListener('keydown', closeOnEscapeKeyDown)
        }
    })



    return (
        <div className={`app-modal ${show? 'show' : ''}`} onClick={onClose}>
            <div className="app-modal-content" onClick={(e) => {e.stopPropagation()}}>
                <div className="modal-header">
                    <h4 className="app-modal-title">{title}</h4>
                </div>
                <div className="app-modal-body">
                    {children}
                </div>
                <div className="app-modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default AppModal
