import React, { useState } from 'react'

const MAX_DESCRIPTION_LENGTH = 500
const MAX_LESSON_NAME_LENGTH = 70

function CreateLessonForm() {
    const [showAddLesson, setShowAddLesson] = useState(false)
    const [lessonName, setLessonName] = useState('')
    const [description, setDescription] = useState('')
    const [price30m, setPrice30m] = useState(0)
    const [price60m, setPrice60m] = useState(0)

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
    return (
        <div>
            {
                showAddLesson ?
                    <div className="mt-3 mb-3">
                        <div className="row">
                            <div className="col-0 col-sm-1 col-md-2 col-lg-2 col-xl-3 col-xxl-4"></div>
                            <form className="col-12 col-sm-10 col-md-8 col-lg-8 col-xl-6 col-xxl-4">
                                <div className="mb-3">
                                    <label for="lessonName" className="form-label"><b>Lesson name</b> ({MAX_LESSON_NAME_LENGTH - lessonName.length} chars left)</label>
                                    <input onChange={onLessonNameChange} value={lessonName} type="text" className="form-control" id="lessonName" />
                                </div>
                                <div className="mb-3">
                                    <label for="description" className="form-label"><b>Description</b> ({MAX_DESCRIPTION_LENGTH - description.length} chars left)</label>
                                    <textarea onChange={onDescriptionChange} className="form-control" id="description" rows={5} wrap="soft" />
                                </div>
                                <div className="mb-3">
                                    <b>Price rates</b>
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-auto"><label for="price-30m" className="form-label">30-minutes session</label></div>
                                    <div className="col-3">
                                        <input type="text"
                                            onChange={onPrice30mChange}
                                            value={price30m}
                                            className="form-control" id="price-30m" />
                                    </div>
                                    <div className="col-auto">$</div>
                                </div>
                                <div className="row g-2 mb-2 ">
                                    <div className="col-auto "><label for="price-60m" className="form-label align-middle">60-minutes session</label></div>
                                    <div className="col-3">
                                        <input type="text"
                                            onChange={onPrice60mChange}
                                            value={price60m}
                                            className="form-control" id="price-60m" />
                                    </div>
                                    <div className="col-auto">$</div>
                                </div>

                                <div style={{ width: "100%" }}>
                                    <button type="button" className="btn btn-danger d-inline-block float-start"
                                        onClick={() => setShowAddLesson(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary d-inline-block float-end" >Add</button>
                                </div>

                            </form>
                            {/* <div className="col-0 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4"></div> */}
                        </div>
                    </div>
                    :
                    <button type="button"
                        class="btn btn-primary"
                        onClick={() => setShowAddLesson(true)}>
                        Add new lesson
                    </button>
            }
        </div>
    )
}

export default CreateLessonForm
