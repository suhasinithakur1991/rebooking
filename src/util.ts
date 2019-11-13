import insertLog from './services/logging';
import sgMail from '@sendgrid/mail';

import * as joi from 'joi';
import { Log } from './modal';
import CONFIG from './config';
import fs from 'fs';
import path from 'path';
const ejs = require('ejs')


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
export function dynamodbResponseToObject(dbRes: any): any {
  const keys = Object.keys(dbRes);

  const jsObj: any = {};

  keys.forEach(key => {
      let dynoType = Object.keys(dbRes[key])[0];
      let value = dbRes[key][dynoType];

      switch (dynoType) {
          case "S":
          case "BOOL":
              jsObj[key] = value;
              break;
          case "N":
              jsObj[key] = parseFloat(value);
              break;
          case "M":
              jsObj[key] = dynamodbResponseToObject(value);
              break;
          case "L":
              jsObj[key] = dynamodbResponseToObject(value);
              break;
      }
  });
  return jsObj;
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

export function getPadding(number: any){
  return number < 10 ? `0${number}` : number
}

export function getNameString(name: any) {
  const title = name.title ? `${titleCase(name.title)} ` : ''
  const firstName = `${titleCase(name.firstName)} `
  const middleName = name.middleName ? `${titleCase(name.middleName)} ` : ''
  const lastName = name.lastName ? `${titleCase(name.lastName)}` : ''
  const fullName = `${title}${firstName}${middleName}${lastName}`
  return fullName
}

export function titleCase(str:any) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

export function getDayMonth(dateModel: any) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let dateSuffix = ["th", "st", "nd", "rd"]
  let month = dateModel[5] + dateModel[6]
  let index = dateModel[9] > 3 ? 0 : dateModel[9]
  let date = dateModel[8] + dateModel[9] + dateSuffix[index]
  let response = date + " " + months[month - 1]
  return response;
}


export function sendGridMail(from: string, to: string, cc: string, bcc: string, subject: string, templatePath: string, content: any, attachment: any, msgKey: any) {
  sgMail.setApiKey(CONFIG.SENDGRID_API_KEY);
  fs.exists(path.join(process.cwd(), templatePath), (fileok) => {
      if (fileok) {
        fs.readFile(path.join(process.cwd(), templatePath), 'utf8', (err, data) => {
          if (err) {
            throw(err)
          } else {
            const html = ejs.compile(data, { filename: path.join(process.cwd(), templatePath) })(content)
            const msg = {
              to: to,
              from: from,
              subject: subject,
              html: html,
              "custom_args": msgKey
            }
            sgMail.send(msg)
            console.log('sent')  
          }
        })
     }
  })
}

export function getTableName(type: string) {
  switch(type) {
    case 'flights': return 'book'
    case 'hotels': return 'hotelBooking'
    case 'cabs': return 'cabs'
    case 'buses': return 'buses'
  }
}
