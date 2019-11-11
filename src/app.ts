import koa from 'koa';
import session from 'koa-generic-session';
import passport from 'koa-passport';
import redisStore from 'koa-redis';
import Router from 'koa-router';
const cors = require('@koa/cors');


import CONFIG from './config';

const koaBody = require('koa-body')(({ multipart: true }));

const router = new Router();
const bookingRouter = require('./routes');

router.use(bookingRouter.routes(), bookingRouter.allowedMethods());

const app = new koa();

function checkOriginAgainstWhitelist(ctx: any) {
  const requestOrigin = ctx.accept.headers.origin;
  // Match Regex for udchalo.com
  var regx = /.udchalo.com$/.exec(requestOrigin);
  if (regx) {
    return requestOrigin;
  }
  if (!CONFIG.CORS_ALLOWED_ORIGINS.includes(requestOrigin)) {
    return CONFIG.CORS_ALLOWED_ORIGINS[0];
  }
  return requestOrigin;
}

app.use(koaBody);
app.use(cors({
  credentials: true,
  origin: checkOriginAgainstWhitelist,
}));
app.proxy = true;

app.keys = [CONFIG.SESSION_KEY];

app.use(session({
  store: redisStore({
    host: CONFIG.REDIS_HOST,
    port: CONFIG.REDIS_PORT,
  }),
  key: process.env.SESSION_KEY_NAME,
  ttl: 1000 * 60 * 60 * 24 * 30,
  rolling: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router.routes());
app.use(router.allowedMethods());

export = app;
