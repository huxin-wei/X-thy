let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors')
let { resolve } = require("path")

let lessonRouter = require('./routes/lesson')
let availabilityRouter = require('./routes/availability')
let authRouter = require('./routes/auth')
let bookingRouter = require('./routes/booking')
let appointmentRouter = require('./routes/appointment')
let unavailable = require('./routes/unavailable')

const {refreshForwardEmails} = require('./js/query')

let app = express();

// app.use(cors())

// app.use(cors({origin: '*'}))

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000' );
  //res.setHeader('Access-Control-Allow-Origin', 'http://13.239.16.220' ); 
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// initialise forward email variable
refreshForwardEmails()

setInterval(() => {
  refreshForwardEmails()
}, 1000 * 60 * 30)


app.disable('etag');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/lesson', lessonRouter);
app.use('/api/availability', availabilityRouter)
app.use('/api/auth', authRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/appointment', appointmentRouter)
app.use('/api/unavailable',unavailable)

app.use(express.static(path.join(__dirname, 'yiwei_vue')))
app.get('/', (req, res) => {
  let absolutePath = resolve('./yiwei_vue/index.html')
  res.sendFile(absolutePath)
})

// Serve Admin's React
app.use(express.static(path.join(__dirname, 'build')))
app.get('/admin(/)?(calendar)?(lesson)?(appointment)?(availability)?(booking)?(upload)?(logout)?', (req, res) => {
  let absolutePath = resolve('./build/index.html')
  res.sendFile(absolutePath)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.head
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.sendFile('./html/404.html', { root: __dirname })
});

module.exports = app;
