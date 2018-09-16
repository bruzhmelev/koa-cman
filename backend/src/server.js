const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const Cors = require('@koa/cors');
const BodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const Helmet = require('koa-helmet');
const respond = require('koa-respond');
const mongoose = require('mongoose');
import { getModel, saveModel } from './stores/modelStore';

const app = new Koa();
const router = new Router();

app.use(Helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(Logger());
}

// sessions
app.keys = ['super-secret-key-434tty'];
app.use(session(app));

app.use(Cors());

// body parser
app.use(
  BodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: function(err, ctx) {
      ctx.throw('body parse error', 422);
    }
  })
);

// // authentication
console.log('authentication');
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

app.use(async (ctx, next) => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
  await next();
  saveModel(ctx.body.model);
});

app.use(respond());

// API routes
require('./routes')(router);
app.use(router.routes());
app.use(require('koa-static')('./build'));
app.use(router.allowedMethods());

mongoose
  .connect(
    'mongodb://cman.documents.azure.com:10255/admin?ssl=true&replicaSet=globaldb',
    {
      auth: {
        user: 'cman',
        password:
          'DmHiPh08m0hQsopkeUWHxHT1PmfHlIOWfbRnAx7vzvVTPMwwPWmlRMBNNhg5eW7X4hJF4xThQuG6LRF3UVAh0Q=='
      }
    }
  )
  .then(() => console.log('connection successful'))
  .catch(err => console.error(err));

module.exports = app;
