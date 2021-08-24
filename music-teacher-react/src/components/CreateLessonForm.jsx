import React, { useState } from 'react'

const MAX_DESCRIPTION_LENGTH = 500
const MAX_LESSON_NAME_LENGTH = 70
const url = 'http://localhost:3001/api'

function CreateLessonForm() {
    const [showAddLesson, setShowAddLesson] = useState(false)
    const [lessonName, setLessonName] = useState('')
    const [description, setDescription] = useState('')
    const [price30m, setPrice30m] = useState('')
    const [price60m, setPrice60m] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [addSuccess, setAddSuccess] = useState(false)

    const onLessonNameChange = (e) => {
        let lessonName = e.target.value
        if (lessonName.length <= MAX_LESSON_NAME_LENGTH) {
            setLessonName(e.target.value)
        } else {
            e.target.value = lessonName
        }
    }

    const onDescriptionChange = (e) => {
        // auto adjust textarea height
        e.target.style.height = "";
        e.target.style.height = Math.min(e.target.scrollHeight, 300) + "px";

        let value = e.target.value

        if (value.length <= MAX_DESCRIPTION_LENGTH) {
            setDescription(value)
        }

        if (value.length > MAX_DESCRIPTION_LENGTH) {
            e.target.value = description
        }
    }

    const onPrice30mChange = (e) => {
        let value = e.target.value
        let isMoney = /^\d+\.{0,1}\d{0,2}$/.test(value)
        if (isMoney || value === '') {
            setPrice30m(value)
        } else {
            e.target.value = ''
        }
    }

    const onPrice60mChange = (e) => {
        let value = e.target.value
        let isMoney = /^\d+\.{0,1}\d{0,2}$/.test(value)
        if (isMoney || value === '') {
            setPrice60m(value)
        } else {
            e.target.value = ''
        }
    }

    const handleAddNewLesson = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setAddSuccess(false)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                lesson: lessonName,
                description: description,
                price30m: price30m,
                price60m: price60m
            })
        }

        fetch(`${url}/lesson`, requestOptions)
            .then(res => {
                if (!res.ok) {
                    throw { message: `${res.status}: Cannot connect to the server.` }
                }
                return res
            })
            .then(res => res.json())
            .then((data) => {
                setError('')
                setLoading(false)
                setAddSuccess(true)
                setShowAddLesson(false)
                setLessonName('')
                setDescription('')
                setPrice30m('')
                setPrice60m('')
            })
            .catch((err) => {
                console.log(err)
                setError(err.message)
                setLoading(false)
            })
    }

    console.log('Create lesson form re render')

    return (
        <div>
            {
                addSuccess &&
                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    <strong>Successfully added.</strong>
                    <button type="button" className="btn-close" onClick={() => setAddSuccess(false)}></button>
                </div>
            }
            {
                showAddLesson ?
                    <div className="mt-3 mb-3">
                        <div className="row">
                            <div className="col-0 col-sm-1 col-md-2 col-lg-2 col-xl-3 col-xxl-4"></div>
                            <form onSubmit={handleAddNewLesson} className="col-12 col-sm-10 col-md-8 col-lg-8 col-xl-6 col-xxl-4">
                                <div className="mb-3">
                                    <label htmlFor="lessonName" className="form-label"><b>Lesson name</b> ({MAX_LESSON_NAME_LENGTH - lessonName.length} chars left)</label>
                                    <input onChange={onLessonNameChange} value={lessonName} type="text" className="form-control" id="lessonName" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label"><b>Description</b> ({MAX_DESCRIPTION_LENGTH - description.length} chars left)</label>
                                    <textarea onChange={onDescriptionChange} className="form-control" id="description" rows={5} wrap="soft" />
                                </div>
                                <div className="mb-3">
                                    <b>Price rates</b>
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-auto"><label htmlFor="price-30m" className="form-label">30-minutes session</label></div>
                                    <div className="col-3">
                                        <input type="text"
                                            onChange={onPrice30mChange}
                                            value={price30m}
                                            maxLength="10"
                                            className="form-control" id="price-30m" />
                                    </div>
                                    <div className="col-auto">$</div>
                                </div>
                                <div className="row g-2 mb-2 ">
                                    <div className="col-auto "><label htmlFor="price-60m" className="form-label align-middle">60-minutes session</label></div>
                                    <div className="col-3">
                                        <input type="text"
                                            onChange={onPrice60mChange}
                                            value={price60m}
                                            maxLength="10"
                                            className="form-control" id="price-60m" />
                                    </div>
                                    <div className="col-auto">$</div>
                                </div>
                                {
                                    error
                                    &&
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                }
                                <div style={{ width: "100%" }}>
                                    <button type="button" className="btn btn-danger d-inline-block float-start"
                                        onClick={() => setShowAddLesson(false)}>Cancel</button>
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
                                setShowAddLesson(true)
                                // setAddSuccess(false)
                            }}>
                            Add new lesson
                        </button>
                    </div>
            }
        </div>
    )
}

export default CreateLessonForm
