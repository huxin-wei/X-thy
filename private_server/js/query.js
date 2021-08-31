const { createConnection } = require('mysql');
let { dbInfo } = require('./music_teacher_db')

const getUser = (email) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from user where email = ? limit 1', [email], (err, rows) => {
      if (err) {
        return reject(err)
      }
      resolve(rows)
    })
    connection.end()
  })
}

const addLesson = (lesson, description, price_30m = 0, price_60m = 0) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('insert into lesson (lesson_name, description, price_30m, price_60m, status) values(?, ?, ?, ?, ?)',
      [lesson, description, price_30m, price_60m, 'active'], (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const getLesson = (lessonId) => {
  return new Promise((resolve, reject) => {
    const connection = createConnection(dbInfo)
    connection.query('select * from lesson where lesson_id = ? AND status = ?',
      [lessonId, 'active'], (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const getLessons = () => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from lesson',
      (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const deleteLesson = (id) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('update lesson set status = ? where lesson_id = ?',
      ['deleted', id], (err, rows) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const addAvailability = (startMinute, endMinute, days) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('insert into availability (start_minute, end_minute, days) values(?, ?, ?)',
      [startMinute, endMinute, days], (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const deleteAvailability = (id) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query(`delete from availability where availability_id = ?`,
      [id], (err, rows) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}


const getAvailability = (day) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from availability where days like ?'
      , [`%${day}%`],
      (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const getAllAvailability = () => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from availability', [],
      (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

const getSameDayAppointmnet = (date) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from booking where status = ? and datediff(?, appointment_start) = 0'
      , ['active', date],
      (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}



// const bookAppointment = (name, email, phone, note, startTime, endTime, duration, lessonId, fee, cancelCode, startMinute, endMinute, dayOfWeek) => {
//   return new Promise((resolve, reject) => {
//     let connection = createConnection(dbInfo)

//     //insert into conditionally to avoid appointment crashing.
//     connection.query(`INSERT INTO booking (customer_name, customer_email, customer_phone, note, 
//       appointment_start, appointment_end, duration, lesson_id, fee, appointment_cancel_code, status) 
//       SELECT ?,?,?,?,?,?,?,?,?,?,? 
//       FROM booking 
//       WHERE EXISTS (SELECT 1
//                     FROM availability
//                     WHERE days like ? AND start_minute <= ? AND end_minute >=  ?
//                     LIMIT 1)
//         AND ? > ?
//         AND NOT EXISTs (SELECT 1 FROM booking 
//                         WHERE datediff(?, appointment_start) = 0 AND 
//                         (? < appointment_start AND ? > appointment_start) OR 
//                         (? >= appointment_start AND ? < appointment_end) 
//                         LIMIT 1) `
//       ,
//       [name, email, phone, note, startTime, endTime, duration, lessonId, fee, cancelCode, 'active', `%${dayOfWeek}%`, startMinute, endMinute, endTime, startTime,
//         startTime, startTime, endTime, startTime, startTime],
//       (err, rows) => {
//         if (err) {
//           return reject(err)
//         }
//         resolve(rows)
//       })
//   })
// }

const bookAppointment = (currentTime, name, email, phone, note, startTime, endTime, duration, lessonId, fee, cancelCode, startMinute, endMinute, dayOfWeek) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)

    //insert into conditionally to avoid appointment crashing.
    connection.query(`INSERT INTO booking (booking_date, customer_name, customer_email, customer_phone, note, 
      appointment_start, appointment_end, duration, lesson_id, fee, appointment_cancel_code, status) 
      SELECT ?,?,?,?,?,?,?,?,?,?,?,? 
      WHERE EXISTS (SELECT 1
                    FROM availability
                    WHERE days like ? AND start_minute <= ? AND end_minute >=  ?
                    LIMIT 1)
        AND ? > ?
        AND NOT EXISTs (SELECT 1 FROM booking 
                        WHERE datediff(?, appointment_start) = 0 AND 
                        (? < appointment_start AND ? > appointment_start) OR 
                        (? >= appointment_start AND ? < appointment_end) 
                        LIMIT 1) `
      ,
      [currentTime, name, email, phone, note, startTime, endTime, duration, lessonId, fee, cancelCode, 'active', `%${dayOfWeek}%`, startMinute, endMinute, endTime, startTime,
        startTime, startTime, endTime, startTime, startTime],
      (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const getAllAppointments = () => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from booking', [],
      (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    connection.end()
  })
}

module.exports = {
  getUser,
  addLesson,
  getLesson,
  getLessons,
  deleteLesson,
  addAvailability,
  deleteAvailability,
  getAllAvailability,
  getAvailability,
  getSameDayAppointmnet,
  bookAppointment,
  getAllAppointments
}