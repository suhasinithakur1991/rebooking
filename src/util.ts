import insertLog from './services/logging';
import * as joi from 'joi';
import { Log } from './modal';

export function getEnvTableName(tableName: string): string {
  switch (process.env.NODE_ENV) {
    case 'dev': return `${tableName}_dev`;
    case 'stage': return `${tableName}_stage`;
    case 'prod': return `${tableName}_production`;
    case 'production': return `${tableName}_production`;
    case 'uat': return `${tableName}_uat`;
    default: return tableName;
  }
}

export function logging(payload: Log) {
  const model = {
    binary_request: payload.request || {},
    binary_response: payload.response || {},
    status: payload.status || 0,
    platform: payload.platform || '',
    level: payload.level,
    type: payload.logType,
    env: process.env.NODE_ENV || 'dev',
    module: 'uc-bookings-sls',
    api: payload.api,
    func: payload.func,
    loggedInUserId: payload.loggedInUserId || '',
    time_taken: payload.timeTaken,
    user_id: payload.userId || null,
    session_id: payload.sessionId || null,
    booking_id: payload.bookingId || null,
    api_session_id: payload.apiSessionId || null,
    user_session_id: payload.userSessionId || null,
    error: payload.error || null,
    stack_trace: payload.stackTrace || null,
    error_code: keyExist('errorCode', payload) ? payload.errorCode : 1,
    time_stamp: new Date(),
    endUserIp: payload.endUserIp || '',
    url: payload.url || '',
    source: payload.source || 'website',
    appVersion: payload.appVersion || '',
    method: payload.method || '',
    arg: payload.arg || {}
  };
  insertLog.log(model);
}

export function keyExist(key: string, obj: object): boolean {
  return key in obj;
}

export function isValid(contract: any) {
  return async (ctx: any, next: any) => {
    const result = joi.validate(ctx.request.body, contract, { abortEarly: true });
    if (result.error === null) {
      await next();
    }
    else {
      ctx.response.body = result.error;
    }
  };
}

export function getTableName(type: string) {
  switch(type) {
    case 'flights': return 'book'
    case 'hotels': return 'hotelBooking'
    case 'cabs': return 'cabs'
    case 'buses': return 'buses'
  }
}
