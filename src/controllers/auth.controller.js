class AuthController {
    login(req, res) {
        res.render('layouts/auth/login', {title: 'Login'});
    }
}

export default new AuthController();