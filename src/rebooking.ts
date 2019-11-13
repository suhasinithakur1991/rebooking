import CONFIG from "./config";
import userEvents from "./db/services/userevent"
import { getDayMonth, getPadding, getNameString, dynamodbResponseToObject, sendGridMail } from "./util";
import { Messages } from "./message";
import { ErrorCodes } from "./error-code";
import cron from 'node-cron'
import api from './services/api';

cron.schedule('* * * * *', () => {
  getUserActivity()
  async function getUserActivity(){
    const emailTitle = CONFIG.EMAILS.NOTIFICATION_TAG
    const userActivity = await userEvents.getUserByActivity()
    const events =  userActivity[0]
    const user = await api.apiRequest(CONFIG.API_REQUEST.GET, `${CONFIG.USER_URL}/userDetails/${(events.userId).trim().split('_')[0]}`,{},{},"","","")    
    const departDate = `${events.request.departDate.year }-${ getPadding(events.request.departDate.month) }-${ getPadding(events.request.departDate.day) }`
    const subject = `Resume your ${events.request.origin} Flight Search For ${getDayMonth(departDate)}`
    const content = {
      url : `http://localhost:4300/api/flights/rebooking?tripType=${events.request.tripType}&&origin=${events.request.origin}&&destination=${events.request.destination}&&departDateMonth=${events.request.departDate.month}&&departDateYear=${events.request.departDate.year}&&departDateDay=${events.request.departDate.day}&&adults=${events.request.adults}&&children=${events.request.children}&&infants=${events.request.infants}&&isDefence=${events.request.isDefence}&&userCategory=${events.request.userCategory}&&cabin=${events.request.cabin}&&isLTCClaim=${events.request.isLTCClaim}&&userSessionId=${events.userSessionId}&&`,
      name : getNameString(user.name) ,
      source: events.request.origin,
      destination: events.request.destination,
      departDate: departDate,
      date : new Date()
  }
  await sendGridMail(emailTitle + " < " + CONFIG.EMAILS.NOTIFICATIONS + " > "  ,user.email, "", "", subject, CONFIG.TEMPLATE.SEARCH, content, "" , {userId: events.userId})
  }
});

class ReBooking {
  
   async userEvents(body: any, ctx: any) {
    console.log("userEvents");
    console.log(body);
    const dynamodbObject = dynamodbResponseToObject(body.OldImage);
    console.log("dynamodbObject", dynamodbObject);
  }

  async sendGridWebhooks(body: any) {
        const { event, userId } = body;
        const model = {
            userId,
            event,
            cronActivityDate : new Date(),
            cronActivityState: CONFIG.VALID_STATE.D1
        }
        const response = await userEvents.dbRequest(userEvents.update, {model: model}, "")
        if(response){
          return { success: true }
        }
   }
}

export = {
  userEvents: new ReBooking().userEvents,
  sendGridWebhooks: new ReBooking().sendGridWebhooks
};
