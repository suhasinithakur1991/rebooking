import { logging, keyExist } from './util';

const _ = require('ramda');

const HTTPResponse = (status: any, body: any) => {
  return {
    status,
    body: body ? body : null,
  };
};

const OK = (response: any) => {
  return HTTPResponse(200, response);
};

const Redirect = (redirectLink: string, sessionId?: string, bookingId?: string, userId?: string) => {
  return {
    redirect: redirectLink,
    body: {
      sessionId,
      bookingId,
      userId,
    },
  };
};

function wrapHandler(handler: any) {
  return async (ctx: any, next: any) => {
    const request = ctx.request.body;
    let sessionId = request && request.sessionId || null;
    let bookingId = request && request.bookingId || null;
    let userId = request && request.userId || null;
    let loggedInUserId = ctx.state.user && ctx.state.user.userId || '';
    const platform = ctx.request && ctx.request.headers && ctx.request.headers.platform || 'desktop';
    const source = ctx.request && ctx.request.headers && ctx.request.headers.source || 'website';
    let errorCode = 1;
    const ip = ctx.request.ip;
    const start = Date.now();
    const apiName = ctx.originalUrl;
    const payload = {
      api: apiName,
      func: handler.name,
      userId,
      bookingId,
      sessionId,
      timeTaken: 0,
      endUserIp: ip,
      status: 1,
      errorCode,
      platform,
      source,
      logType: 'repo',
      error: '',
      request: {},
      response: {},
      loggedInUserId,
      url: ctx.request.header && `${ctx.request.header.host}${ctx.request.url}` || ctx.originalUrl,
      method: ctx.request.method,
    };
    try {
      const body = { ...ctx.request.body, endUserIp: ip };
      const url = ctx.request.url;
      // appUtil.setHTTPHeader(ctx.request.header)
      const response = _.equals(ctx.request.method, 'POST') ? await handler(body, _.merge(ctx, {}), await next()) : await handler(_.merge(ctx, {}), await next());
      if (response && response.redirect) {
        ctx.redirect(response.redirect);
      }
      if (response) {
        for (const key in response) {
          ctx[key] = response[key];
        }
        sessionId = !sessionId ? response.body ? response.body.sessionId ? response.body.sessionId : null : null : sessionId;
        bookingId = !bookingId ? response.body ? response.body.bookingId ? response.body.bookingId : null : null : bookingId;
        userId = !userId ? response.body ? response.body.userId ? response.body.userId : null : null : userId;
        errorCode = response.body ? keyExist('errorCode', response.body) ? response.body.errorCode : 1 : 1;
        const ms = Date.now() - start;
        const uploadPayload = { ...payload, userId, bookingId, sessionId, timeTaken: ms, status: response.status, errorCode, level: 'info', request: body, response: response.body };
        // console.log('koaUtil: ', uploadPayload);
        logging(uploadPayload);
      }
    }
 catch (err) {
      const uploadPayload = { ...payload, error: err, level: 'error' };
      console.log('koaUtil error: ', payload);
      logging(uploadPayload);
      ctx.status = err.statusCode || 500;
      ctx.body = {
        success: false,
        message: err.message,
      };
    }
  };
}

const wrapHandlerModule = (module: any) => _.fromPairs( _.map(([name, fun]: any) => [name, wrapHandler(fun)], _.toPairs(module)));

module.exports = {
  wrapHandlerModule,
  OK,
  Redirect,
};
