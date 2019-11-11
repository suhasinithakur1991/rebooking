import { Messages } from './message';
const passport = require('koa-passport');

// to check if user is logged in
const isAdminAuth = (allowedRoles: any) => {
  return async (ctx: any, next: any) => {
    if (ctx.isAuthenticated()) {
      ctx.body = ctx.state.user;
      // If request has allowed roles access
      if (allowedRoles) {
        if (isAllowed(allowedRoles, ctx)) {
          await next();
        }
 else {
          ctx.body = {
            success: false,
            response: null,
            message: Messages.NOT_ALLOWED,
          };
          ctx.status = 200;
        }
      }
 else { // Normal authenticated user
        await next();
      }
    }
 else {
      ctx.body = {
        success: false,
        authenticated: false,
        message: Messages.NOT_AUTHORISED,
        errorCode: 102,
      };
      ctx.status = 203;
    }
  };
};

const isAuth = async (ctx: any, next: any) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.state.user;
    await next();
  }
 else {
    ctx.body = {
      success: false,
      authenticated: false,
      message: Messages.NOT_AUTHORISED,
      errorCode: 102,
    };
    ctx.status = 203;
  }
};

const isAllowed = (allowedRoles: any, ctx: any) => {
  const user = ctx.state.user;
  let isAllowed = false;
  const roles = user.userRoles;
  allowedRoles.forEach((allowedRole: any) => {
    if (roles.includes(allowedRole)) {
      isAllowed = true;
    }
  });
  return isAllowed;
};


passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});

export = {
  isAuth,
  isAdminAuth,
}
