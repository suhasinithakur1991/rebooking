import rebooking = require("./rebooking");
import config from "./config";
import { Messages } from "./message";
import { response } from "express";
const { OK } = require("./koaUtil");

class Handler {
  async userEvents(body: any, ctx: any) {
      console.log("body", body)
      const loggedInUserId = ctx.state.user ? ctx.state.user.userId ? ctx.state.user.userId : '' : '';
      const response = rebooking.userEvents(body, ctx)
      // const response = { success: true}
      // return OK(response)
  }

  async sendgridWebooks(body: any, ctx: any){
    console.log("sendGridWebHooks")
    console.log(body[0])
    const response = rebooking.sendGridWebhooks(body[0])
    return response
  }
}

export default {
  userEvents: new Handler().userEvents,
  sendgridWebooks: new Handler().sendgridWebooks
};
