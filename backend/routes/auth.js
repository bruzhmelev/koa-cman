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
    if (existingUsers.length !== 0) {
      ctx.status = 404;
      ctx.body = { status: 'error', message: 'Пользователь уже существует' };
    }

    if (user) {
      ctx.login(user);
      ctx.body = user;
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error', err };
    }
  })(ctx);
});

module.exports = router.routes();
