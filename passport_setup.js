let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');
let models = require('./models');

const validPassword = function(user,password){
    return bcrypt.compareSync(password,user.password);
}

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null,user.id)
    });
    passport.deserializeUser(function(id,done){
        models.User.findOne({
            where:{
                'id': id
            }
        }).then(user =>{
            if(user==null) {
                done(new Error ("Wrong User ID."));
            }
            done(null,user);
        })
    });
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req,email,password,done){
        return models.User.findOne({
            where:{
                'email':email
            }
        }).then(user => {
            if (user == null){
                req.flash('message','Incorrect Credentials');
                return done(null,false);
            } else if (user.password == null || user.password == undefined){
                req.flash('message','Reset your password');
                return done(null,false);
            } else if (!validPassword(user,password)){
                req.flash('message','Incorrect Credentials');
                return done(null,false);
            }
            return done(null,user)
        }).catch(err => {
            done(err,false);
        })
    }))
}