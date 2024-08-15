function login_get(req, res) {
    res.render('auth/login', { title: 'Login' });
}

function login_post(req, res) {
    console.log(req.body);
    res.redirect('/');
}

function signup_get(req, res) {
    res.render('auth/signup', { title: 'Sign Up' });
}

function signup_post(req, res) {
    const { name, email, password } = req.body;
    console.log("name: ", name, "email: ", email, "password: ", password);
    console.log(req.body);
    res.redirect('/');
}

module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post
};
