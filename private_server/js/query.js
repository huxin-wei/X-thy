let db_connection = require('./music_teacher_db')

const addLesson = (lesson, description, price_30m = 0, price_60m = 0) => {
    return new Promise((resolve, reject) => {
        db_connection.query('insert into lesson (lesson_name, description, price_30m, price_60m, status) values(?, ?, ?, ?, ?)',
        [lesson, description, price_30m, price_60m, 'active'], (err, rows) => {
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