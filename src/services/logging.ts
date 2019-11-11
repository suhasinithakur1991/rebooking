import { ESLogModel } from '../modal';
import config from '../config';
const AWS = require('aws-sdk');
const firehoser = require('firehoser');

AWS.config.update({
  region: 'ap-south-1',
});

const maxDelay = config.LOGGER_MAX_DELAY_TIME;
const maxQueued = config.LOGGER_MAX_QUEUE;

const firehose = new firehoser.JSONDeliveryStream(config.LOGGER_AUTH_DELIVERY_STREAM, maxDelay, maxQueued);

class Logging {
  log(record: ESLogModel): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await firehose.putRecord(record)
        resolve(response)
      }
 catch(error) {
        console.log('LogError: ', error)
        reject(error)
      } 
    });
  }
}

export default new Logging();
