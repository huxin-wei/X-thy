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

const addAvailability = (timeFrom, timeTo, days) => {
    return new Promise((resolve, reject) => {
        db_connection.query('insert into availability (minute_start, minute_end, days) values(?, ?, ?)',
        [timeFrom, timeTo, days], (err, rows) => {
            if(err){
                return reject(err)
            }
            resolve(rows)
        })
    })
}

const getAvailability = (day) => {
    return new Promise((resolve, reject) => {
        db_connection.query('select * from availability where status = ? and days like ?'
        , ['active', `%${day}%`],
        (err, rows) => {
            if(err){
                return reject(err)
            }
            resolve(rows)
        })
    })
}

const getSameDayAppointmnet = (date) => {
    return new Promise((resolve, reject) => {
        db_connection.query('select * from app where status = ? and datediff(?, appointment_start) = 0'
        , ['active', date],
        (err, rows) => {
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
    deleteLesson,
    addAvailability,
    getAvailability,
    getSameDayAppointmnet
}