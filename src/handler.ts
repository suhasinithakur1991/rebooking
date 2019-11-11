import booking = require('./booking');
import config from './config';
import { Messages } from './message';
const { OK } = require('./koaUtil');

class Handler {
    async getRefund(ctx:any){
        const response = {success: true}
        return OK(response)
    }
}

export default {
    getRefund:(new Handler()).getRefund,
};
