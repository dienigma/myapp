let models = require('../models')
let bcrypt = require('bcrypt')
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
const flash = require('connect-flash');

exports.show_login = (req,res, next) => {
    res.render('user/login',{formData:{}, errors:{}});
}

exports.show_signup = (req,res, next) => {
    res.render('user/signup',{formData:{}, errors:{}});
}

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

exports.signup = (req,res,next) => {
    const newUser = models.User.build({
        email:req.body.email,
        password: generateHash(req.body.password)
    });
    return newUser.save().then(result => {
        passport.authenticate('local',{
            successRedirect: "/",
            failureRedirect:"/signup",
            failureFlash: true
        })(req,res,next)
    })
}

exports.login = (req,res,next) => {
    passport.authenticate('local',{
        successRedirect: "/",
        failureRedirect:"/login",
        failureFlash: true
    })(req,res,next)
}

exports.logout = function(req, res, next) { 
	req.logout();
	req.session.destroy();
	res.redirect('/');
}