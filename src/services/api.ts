import CONFIG from '../config';
import request from 'request';
import { logging, keyExist } from '../util';

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
  json: true,
  timeout: CONFIG.API_INTERVAL,
};

class Api {
  get(url: string, headers: object): Promise<any> {
    const updatedHeaders = headers ? { ...options.headers, ...headers } : options.headers;
    return new Promise((resolve, reject) => {
      request.get(url, { headers: updatedHeaders }, function(error: any, response: any, body: any) {
        if(error) {
          reject(error);
        }
        if (body && response.statusCode && response.statusCode === 200) {
            resolve(body);
        }
        resolve(null);
      });
    });
  }

  post(url: string, payload: object, headers: object): Promise<any> {
    const updatedHeaders = headers ? { ...options.headers, ...headers } : options.headers;
    return new Promise((resolve, reject) => {
      try {
        request.post(url, { body: JSON.stringify(payload), headers: updatedHeaders }, function(error: any, response: any, body: any) {
          if(error) {
            reject(error);
          }
          if (body && response.statusCode && response.statusCode === 200) {
              resolve(body);
          }
          resolve(null);
        });
      }
      catch (error) {
        reject(error);
      }
    });
  }

  formPost(url: string, form: object): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({ url, form }, (error: any, response: any, body: any) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(response);
        }
      });
    });
  }

  apiRequest(reqMethod: string, reqUrl: string, reqHeaders: object, reqBody?: object, bookingId?: string, sessionId?: string, userId?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const start = Date.now();
      const body = reqBody || {};
      let errorCode = 3;
      let status = 1;

      const payload = {
        api: reqUrl,
        func: '',
        timeTaken: 0,
        status,
        errorCode,
        logType: 'api',
        error: '',
        request: { url: reqUrl, headers: reqHeaders, payload: body },
        response: {},
        url: reqUrl,
        method: reqMethod,
        sessionId: sessionId || '',
        bookingId: bookingId || '',
        userId: userId || ''
      }
      try {
        let result;
        switch(reqMethod) {
          case CONFIG.API_REQUEST.GET:
            result = await this.get(reqUrl, reqHeaders);
            break;
          case CONFIG.API_REQUEST.POST:
            result = await this.post(reqUrl, body, reqHeaders);
            break;
          case CONFIG.API_REQUEST.PUT:
            break;
          case CONFIG.API_REQUEST.FORM_POST:
            result = await this.formPost(reqUrl, body);
            break;
        }
        const response = JSON.parse(result);
        // errorCode = response ? keyExist('errorCode', response) ? response.errorCode : 0 : 3;
        // status = response && response.statusCode || 1;
        const ms = Date.now() - start;
        // const uploadPayload = { ...payload, response, status, errorCode, timeTaken: ms, level: 'info' }
        // console.log('apiRequest payload: ', uploadPayload);
        // logging(uploadPayload);
        if(response)
          resolve(response.response ? response.response : response);
        resolve(null);
      }
 catch(error) {
        const uploadPayload = { ...payload, errorCode: 3, bookingId, sessionId, error, level: 'error' };
        console.log('apiRequest error: ', uploadPayload);
        logging(uploadPayload);
        reject(error);
      }
    });
  }
}

export default new Api();
