class AuthController {
    login(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        } else {
            res.render('layouts/auth/login', {
                flash: req.flash() || null,
            });
        }
    }


    changePassword(req, res) {
        res.render('layouts/auth/ChangePass', {error: req.flash('error') || null});
    }

    resetPassword(req, res) {
        res.render('layouts/auth/ResetPass', {error: req.flash('error') || null});
    }
}

export default new AuthController();