var express=require('express');
var path= require('path');
var bodyParser=require('body-parser');
var logger = require('morgan');

//var index= require('./routes/index');
//var tasks =require('./routes/tasks');

var app=express();

// View Engine

app.set('views',path.join(__dirname,'ui/dist'));
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

//Set Static Folders Angulat Stuff
app.use(express.static(path.join(__dirname,'ui/dist')));

// Body Parser; Middle Layer
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,token,Authorization');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});


// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/api/*', [require('./middleware/validaterequest')]);
 
app.use('/', require('./routes'));
 
// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//app.use('/',index);
//app.use('/api',tasks);

var port=3000;
app.listen(port,function(){

console.log('Application is runnning on port '+port);

});


