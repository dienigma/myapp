exports.show_login = (req,res, next) => {
    res.render('user/login',{formData:{}, errors:{}});
}

exports.show_signup = (req,res, next) => {
    res.render('user/signup',{formData:{}, errors:{}});
}