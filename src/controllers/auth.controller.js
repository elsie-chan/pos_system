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
        res.render('layouts/auth/resetpassword', {
            title: 'Reset Password',
            flash: req.flash() || null
        }
        );
    }

    resetPassword(req, res) {
        res.render('layouts/auth/ResetPass', {error: req.flash('error') || null});
    }
}

export default new AuthController();