import React, { useState } from 'react'
import { TiEdit, TiTrash } from 'react-icons/ti'


function Lesson(props) {
    const [lessonName, setLessonName] = useState(props.lessonName)
    const [description, setDescription] = useState(props.description)
    const [price30m, setPrice30m] = useState(props.price30m)
    const [price60m, setPrice60m] = useState(props.price60m)

    return (
        <div className="mb-2 pd-4">
            <div className="row">
                <div className="col-0 col-sm-1  col-lg-2 col-xl-3"></div>
                <div className="border-bottom mb-3 pb-2 col-12 col-sm-10 col-lg-8 col-xl-6">

                    <h1 className="text-primary">{lessonName}</h1>
                    <div className="ms-3 mb-2">
                        <p className="text-secondary">{description}</p>
                        <p className="mb-1 text-secondary"><b>Fee rates</b></p>
                        <p className="mb-1 text-secondary">30 minutes: <b>${price30m}</b></p>
                        <p className="mb-1 text-secondary">60 minutes: <b>${price60m}</b></p>
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
    )
}

export default Lesson
