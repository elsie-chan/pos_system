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
            title: 'Change Password',
            flash: req.flash() || null
        }
        );
    }

    resetPassword(req, res) {
        res.render('layouts/auth/reset', {
            title: 'Reset Password',
            error: req.flash('error') || null
        });
    }
}

export default new AuthController();