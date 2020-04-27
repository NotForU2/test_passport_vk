var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var VkStrategy = require('passport-vkontakte').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var request = require('request-promise');

var VK_APP_ID = '7434469';
var VK_APP_SECRET = 'obxbIm89sspfA2noYaFN';

passport.use(new VkStrategy(
    {
      clientID: VK_APP_ID,
      clientSecret: VK_APP_SECRET,
      callbackURL: "https://alka99.herokuapp.com/auth/vk/callback",
      scope: ['friends'],
        profileFields: ['photo_100']
    },
    function verify(accessToken, refreshToken, params, profile, done) {
        var options = {
            uri:  'https://api.vk.com/method/friends.search?count=5&fields=photo_100&order=random&access_token='+accessToken+'&v=5.64',
            method: 'GET',
            json: true
        };
        request(options)
            .then((response) => {
                var user ={
                    ...profile,
                    friends: response.response.items
                };
                return done(null, user);
            })
            .catch((err) => {
                console.log(err);
            });
    }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({secret:'my cucaramba', resave: true, saveUninitialized: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
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
