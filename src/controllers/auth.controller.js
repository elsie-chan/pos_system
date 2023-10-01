class AuthController {
    login(req, res) {
        res.render('auth/login', {layout: 'layouts/auth'});
    }
}