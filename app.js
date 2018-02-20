var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var helpers = require('./lib/helpers');
var multer = require('multer');
var uploads = multer({
  dest: 'uploads/',
  rename: function (fieldname, filename) {
      console.log("Rename...");
      return filename + Date.now();
  },
  onFileUploadStart: function () {
      console.log("Upload is starting...");
  },
  onFileUploadComplete: function () {
      console.log("File uploaded");
  }
});
const fileUpload = require('express-fileupload');

const dotenv = require('dotenv');
dotenv.load({ path: '.env' });
console.log("DBNAME: " + process.env.dbname);


var uri = 'mongodb://mdbppApp:2Secure2Handle@cluster0-shard-00-00-ri4jv.mongodb.net:27017,cluster0-shard-00-01-ri4jv.mongodb.net:27017,cluster0-shard-00-02-ri4jv.mongodb.net:27017/mdbpp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

  mongoose.connect(process.env.MONGODB_ATLAS_URI); 

//mongoose.connect('mongodb://localhost/' + process.env.dbname);  //wroks


var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var create = require('./routes/create');
var search = require('./routes/search');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout', helpers: helpers}));
app.set('view engine', 'handlebars');
app.use(require('connect-assets')({
  src: 'public',
  helperContext: app.locals
}));


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret22',
    saveUninitialized: false,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/create', create);
app.use('/search', search);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});