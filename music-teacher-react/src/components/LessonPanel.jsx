import React, {useState, useRef} from 'react'
import CreateLessonForm from './CreateLessonForm'
import LessonPanel from './Lesson'

function Lesson() {
    let dummyNum = useRef(0)
    const [num, setNum] = useState(0)

    return (
        <div className="pt-3">
            <button type="button" onClick={()=> {dummyNum.current = dummyNum.current + 1; console.log('clicked'); console.log(dummyNum.current)}} >r23r</button>
            <CreateLessonForm />
            <LessonPanel dummyNum={dummyNum}/>
        </div>
    )
}

export default Lesson
