const Router = require('koa-router');
const passport = require('koa-passport');
const storage = require('../temp/localUserStorage');

const router = new Router();

router.post('/localregister', async ctx => {
  console.log('/localregister: ' + JSON.stringify(ctx.request.body));
  const newUser = ctx.request.body;
  const existingUsers = await storage.fetchUsersByName(newUser.username);

  if (existingUsers.length === 0) {
    await storage.addUser(ctx.request.body);
  } else {
    ctx.status = 404;
    ctx.body = { status: 'error', message: 'Пользователь уже существует' };
    return;
  }

  return passport.authenticate('local', (err, user) => {
    console.log(JSON.stringify({ err, user }));

    if (user) {
      ctx.login(user);
      ctx.body = user;
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error', err };
    }
  })(ctx);
});

router.post('/login', async ctx => {
  console.log('/login: ' + JSON.stringify(ctx.request.body));
  const user = ctx.request.body;
  const existingUsers = await storage.fetchUsersByName(user.username);

  if (existingUsers.length !== 1) {
    ctx.status = 404;
    ctx.body = { status: 'error', message: 'Пользователь не существует' };
    return;
  }

  return passport.authenticate('local', (err, user) => {
    if (user) {
      ctx.login(user);
      ctx.body = user;
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error', err };
    }
  })(ctx);
});

/* FACEBOOK ROUTER */
router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/loginfailureRedirect'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router.routes();
