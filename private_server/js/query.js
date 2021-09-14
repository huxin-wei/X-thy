const { createConnection } = require('mysql');
let { dbInfo } = require('./music_teacher_db')


// initially create tables
//var connection = mysql.createConnection({multipleStatements: true});

const createSystemTables = () => {

}

const getUser = (email) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from user where email = ? limit 1', [email], (err, rows) => {
      connection.end()
      if (err) {
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const addLesson = (lesson, description, price_30m = 0, price_60m = 0) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('insert into lesson (lesson_name, description, price_30m, price_60m, status) values(?, ?, ?, ?, ?)',
      [lesson, description, price_30m, price_60m, 'active'], (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const getLesson = (lessonId) => {
  return new Promise((resolve, reject) => {
    const connection = createConnection(dbInfo)
    connection.query('select * from lesson where lesson_id = ? AND status = ?',
      [lessonId, 'active'], (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })

  })
}

const getLessons = () => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from lesson',
      (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })

  })
}

const deleteLesson = (id) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('update lesson set status = ? where lesson_id = ?',
    ['deleted', id], (err, rows) => {
        connection.end()
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const addAvailability = (startMinute, endMinute, days) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('insert into availability (start_minute, end_minute, days) values(?, ?, ?)',
      [startMinute, endMinute, days], (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const deleteAvailability = (id) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query(`delete from availability where availability_id = ?`,
      [id], (err, rows) => {
        connection.end()
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve(rows)
      })
  })
}


const getAvailability = (day) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from availability where days like ?'
      , [`%${day}%`],
      (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const getAllAvailability = () => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from availability', [],
      (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const getSameDayAppointmnet = (date) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select * from booking where status = ? and datediff(?, appointment_start) = 0'
      , ['active', date],
      (err, rows) => {
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}



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
                        WHERE status = 'active' AND datediff(?, appointment_start) = 0 AND 
                        ((? < appointment_start AND ? > appointment_start) OR 
                        (? >= appointment_start AND ? < appointment_end))
                        LIMIT 1) `
      ,
      [currentTime, name, email, phone, note, startTime, endTime, duration, lessonId, fee, cancelCode, 'active', `%${dayOfWeek}%`, startMinute, endMinute, endTime, startTime,
        startTime, startTime, endTime, startTime, startTime],
      (err, rows) => {
        connection.end()
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
        connection.end()
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
  })
}

const getUpcomingAppointment = (now) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query('select appointment_id, appointment_start, duration, customer_name from booking where appointment_start >= ?', [now],
    (err, rows) => {
      connection.end()
      if(err){
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const getAppointmentById = (id) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)
    connection.query(`select * from booking
    inner join lesson as L
    ON booking.lesson_id = L.lesson_id where appointment_id = ?`, [id],
    (err, rows) => {
      connection.end()
      if(err){
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const getAppointmentBetween = (beginDate, endDate, status) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)

    connection.query(`select appointment_id, customer_name, L.lesson_name, appointment_start, duration 
    FROM booking
    INNER JOIN lesson as L
    ON booking.lesson_id = L.lesson_id 
    WHERE booking.status = ? AND appointment_start >= ? AND appointment_start < ?` , [status, beginDate, endDate],
    (err, rows) => {
      connection.end()
      if(err){
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const cancelAppointmentByCode = (id, code) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)

    connection.query(`UPDATE booking SET status = 'cancelled' where appointment_id = ? AND appointment_cancel_code = ?`, [id, code],
    (err, rows) => {
      connection.end()
      if(err){
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const cancelAppointmentById = (id) => {
  return new Promise((resolve, reject) => {
    let connection = createConnection(dbInfo)

    connection.query(`UPDATE booking SET status = 'cancelled' where appointment_id = ?`, [id],
    (err, rows) => {
      connection.end()
      if(err){
        return reject(err)
      }
      resolve(rows)
    })
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
  getUpcomingAppointment,
  getAppointmentById,
  bookAppointment,
  getAllAppointments,
  getAppointmentBetween,
  cancelAppointmentByCode,
  cancelAppointmentById
}