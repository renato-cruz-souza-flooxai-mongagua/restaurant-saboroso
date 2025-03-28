var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var RedisStore = require('connect-redis')(session) 
var formidable = require("formidable")
var path = require("path")

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin'); //aqui

var app = express();

app.use(function (req, res, next) {
  req.body = {};

  if (req.method === "POST") {
    const form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true, 
      allowEmptyFiles: true,
      minFileSize: 0,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log("Caminho do arquivo:", files.photo[0].filepath);

        console.error("Erro ao processar o formulário:", err);
        return res.status(500).json({ error: "Erro ao processar o formulário", details: err });
      }

      req.body = fields;
      req.fields = fields;
      req.files = files;

      next();
    });
  } else {
    next();
  }
});
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379
  }),
  secret: 'password',
  resave: true,
  saveUninitialized: true //aqui
}))

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
