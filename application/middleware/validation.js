const checkUsername = (username) => {
    return /^\D\w{2,}$/.test(username);
}

const checkPassword = (password) => {
    return (/.{8,}/.test(password) && /[A-Z]+/.test(password) && /[0-9]+/.test(password) && /[/*-+!@$^&*]+/.test(password));
}

const checkEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
}

const registerValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!checkUsername(username)) {
        req.flash("error", "Invalid username.");
        req.session.save((err) => {
            res.redirect("/register");
        });
    } else {
        if (!checkPassword(password)) {
            req.flash("error", "Invalid password.");
            req.session.save((err) => {
                res.redirect("/register");
            });
        } else {
            if (!checkEmail(email)) {
                req.flash("error", "Invalid email.");
                req.session.save((err) => {
                    res.redirect("/register");
                });
            } else {
                next();
            }
        }
    }
}

module.exports = {registerValidator};