const url = 'http://localhost:3000'
console.log('Hello world!')

const showForm = () => {
    console.log(`showForm function fired`)
    let str = `<div class="lesson-form mg-top-50">
    <form>
        <p class="warning" id="warning"></p>
        <label for="lesson">Lesson</label>
        <input type="text" id="lesson" name="lesson" class="shadow-input" required>

        <label for="description">Description</label>
        <textarea id="description" name="description" rows="5"  class="shadow-input"></textarea>

        <div>
            Price Rate
        </div>
        <div>
            <label name="price-30" for="price-30">
                30 munites
            </label>
            <input type="text" id="price-30" name="price-30" style="width: 120px" class="shadow-input">
            <span>$</span>
        </div>
        <div>
            <label name="price-60" for="price-60">
                60 munites
            </label>
            <input type="text" id="price-60" name="price-60" style="width: 120px" class="shadow-input">
            <span>$</span>
        </div>


        <div style="position: relative">
            <button type="button" onclick="hideForm()" class="default left pd-15 shadow-box" style="position: absolute; bottom: 0" >cancel</button>
            <button type="submit" onclick="createNewLesson(event)" class="add shadow-box scaleup right pd-lr-20 fz-15">
                <p>Add</p>
            </button>
        </div>

    </form>
</div>`
    document.getElementById("create-lesson-form").innerHTML = str
}

const hideForm = () => {
    document.getElementById("create-lesson-form").innerHTML = ''
}

const createNewLesson = (event) => {
    event.preventDefault()
    console.log(`createNewLesson function fired`)

    const lesson = document.getElementById("lesson").value

    //Lesson name is require
    if (!lesson) {
        document.getElementById("warning").innerHTML = 'Require lesson name'
        return
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-type': 'Application/json' },
        body: JSON.stringify({
            lesson: document.getElementById("lesson").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            duration: document.getElementById("duration").value
        })
    }

    fetch(`${url}/lesson`, requestOptions)
        .then(res => res.json())
        .then((data) => {
            console.log(`succesfully`)
            console.log(data)
            document.getElementById("warning").innerHTML = ''
            fetchLessons()
        })
        .catch(err => {
            console.log(err)
            document.getElementById("warning").innerHTML = err
        })
}

const showLessons = () => {
    let str = ''
    str += ``
}

const deleteLesson = (event) => {
    const lessonId = event.target.id || event.target.parentElement.id
    console.log(lessonId)
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-type': 'Application/json' },
    }

    fetch(`${url}/lesson/${lessonId}`, requestOptions)
        .then(res => res.json())
        .then(() => {
            fetchLessons()
        })
        .catch(error => {
            console.log(error)
        })
}

const fetchLessons = () => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-type': 'Application/json' },
    }

    let str = ''

    fetch(`${url}/lesson`, requestOptions)
        .then(res => res.json())
        .then(res => {
            const data = res.data
            return data
        })
        .then(lessons => {
            lessons.forEach(lesson => {
                str += `<div class="lesson-wrapper">
                <h4>${lesson.lesson_name}</h4>
                <p>${lesson.description}</p>
                <p><b>${lesson.duration} minutes</b></p>
                <p><b>$${lesson.price}</b></p>
                <div class="mg-bt-10" style="height: 20px">
                    <button type="button" class="left edit" >
                        <span class="tooltip">Edit</span>
                        <i class="fa fa-pencil-square-o" aria-hidden="true" style="font-size: 25px;"></i>
                    </button>
                    
                    <button id="${lesson.lesson_id}" onclick="deleteLesson(event)" type="button" class="delete right">
                        <span class="tooltip">Delete</span>
                        <i class="fa fa-trash-o" aria-hidden="true" style="font-size: 25px;"></i>
                    </button>
                </div>
            </div>`
            });
        })
        .then(() => {
            document.getElementById("lessons").innerHTML = str
        })
        .catch(error => {
            console.log(error)
        })
}

fetchLessons()

{/* <div>
<label name="duration">Duration</label>
<select id="duration" name="duration" class="shadow-input">
    <option value="30">30</option>
    <option value="60" selected>60</option>
    <option value="90">90</option>
    <option value="120">120</option>
    <option value="180">180</option>
    <option value="240">240</option>
</select>
<span> minutes</span>
</div> */}