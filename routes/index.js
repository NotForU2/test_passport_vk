var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res){
  res.render('index', { user: req.user });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
router.get('/auth/vk',
    passport.authenticate('vkontakte'),
    function(req, res){
    });
router.get('/auth/vk/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

module.exports = router;
