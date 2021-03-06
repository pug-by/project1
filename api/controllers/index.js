var checkAuth = require('middleware/checkAuth'),
    isSignedIn = require('middleware/isSignedIn');

module.exports = function(app) {

    app.get('/', isSignedIn, function(req, res) {
        res.render('auth/index', {});
    });

    app.get('/app', checkAuth, function(req, res) {
        res.render('app/index', {});
    });

    app.post('/logout', checkAuth, function(req, res, next) {
        var sid = req.session.id;

        var io = req.app.get('io');
        req.session.destroy(function(err) {
            io.sockets.$emit("session:reload", sid);
            if (err) return next(err);

            res.redirect('/');
        });
    });

    app.post('/api/auth/login', require('./API/Auth').login);
    app.post('/api/auth/register', require('./API/Auth').register);
}
