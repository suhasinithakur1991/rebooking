import userEvent from "../userEvent";
import { logging, keyExist } from "../../util";
import { AggregateError } from "redis";
import { resolve } from "url";
import { rejects } from "assert";

class Rebooking {
  update(arg: any): Promise<any> {
    const model = arg.model;
    return new Promise((resolve, reject) => {
      userEvent.update(model, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else if (res) {
          resolve(res.attrs);
        }
        resolve(null);
      });
    });
  }

  getUserByActivity(): Promise<any>{
    return new Promise((resolve, reject) => {
          userEvent.query(1)
          .usingIndex('isEnabled')
          .filter('activity').equals('search')
          .filter('product').equals('flights')
          .filter('cronActivityState').equals('D0')
          .exec((error: any, res: any)=>{
              if(error){
                  reject(error)
              }
              if(res){
                const items = JSON.parse(JSON.stringify(res.Items))
                  if (items && items.length > 0){ 
                    resolve(items);
                }
              }
              resolve(null)
          })
      })
  }

  async dbRequest(
    fn: Function,
    arg: any,
    loggedInUserId?: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let errorCode = 0;
      let status = 1;
      const bookingId = keyExist("bookingId", arg) ? arg.bookingId : "";
      const sessionId = keyExist("sessionId", arg) ? arg.sessionId : "";
      const userId = keyExist("userId", arg) ? arg.userId : "";
      const payload = {
        api: "",
        func: fn.name,
        timeTaken: 0,
        status,
        errorCode,
        logType: "db",
        error: "",
        request: { function: fn.name, arguments: arg },
        response: {},
        method: "",
        sessionId,
        bookingId,
        userId,
        loggedInUserId: loggedInUserId || "",
        arg: arg || {}
      };
      try {
        const start = Date.now();
        const response = await fn(arg);
        const ms = Date.now() - start;
        const uploadPayload = {
          ...payload,
          arg,
          response,
          status,
          errorCode,
          level: "info",
          timeTaken: ms
        };
        console.log("dbRequest payload: ", uploadPayload);
        logging(uploadPayload);
        resolve(response);
      } catch (error) {
        errorCode = 2;
        const uploadPayload = {
          ...payload,
          arg,
          error,
          errorCode,
          level: "error"
        };
        console.log("dbRequest error: ", uploadPayload);
        logging(uploadPayload);
        reject(error);
      }
    });
  }
}

export default {
  dbRequest: new Rebooking().dbRequest,
  update: new Rebooking().update,
  getUserByActivity: new Rebooking().getUserByActivity
};
