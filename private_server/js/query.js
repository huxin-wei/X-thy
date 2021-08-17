let db_connection = require('./music_teacher_db')

const addLesson = (lesson, description, duration = 60, price = 0) => {
    return new Promise((resolve, reject) => {
        db_connection.query('insert into lesson (lesson_name, description, duration, price, status) values(?, ?, ?, ?, ?)',
        [lesson, description, duration, price, 'active'], (err, rows) => {
            if (err){
                return reject(err)
            }
            resolve(rows)
        })
    })
}

const getLessons = () => {
    return new Promise((resolve, reject) => {
        db_connection.query('select * from lesson',
        (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows)
        })
    })
}

const deleteLesson = (id) => {
    return new Promise((resolve, reject) => {
        db_connection.query('update lesson set status = ? where lesson_id = ?',
        ['deleted', id], (err, rows) => {
            if(err){
                return reject(err)
            }
            resolve(rows)
        })
    })
}


module.exports = {
    addLesson,
    getLessons,
    deleteLesson
}