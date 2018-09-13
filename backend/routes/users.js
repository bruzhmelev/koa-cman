const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/users');

/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('user', { user: req.user });
});

function ensureAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  return next();
  //   }
  //   res.redirect('/login');
}

module.exports = router.routes();
