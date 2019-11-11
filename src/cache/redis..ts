const redis = require('redis');
import CONFIG from '../config';

const client = redis.createClient({
  port: CONFIG.REDIS_PORT,
  host: CONFIG.REDIS_HOST,
  enable_offline_queue: CONFIG.REDIS_ENABLE_OFFLINE_QUEUE,
  retry_strategy: (options: any) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // end reconnecting on a specific error and flush all commands with a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // end reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // end reconnecting with built in error
      return 'undefined';
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

if (CONFIG.REDIS_PASSWORD != null) {
  client.auth(CONFIG.REDIS_PASSWORD, (err: any, reply: any) => {
    if (err) {
      console.info('Auth Error: ', err);
    }
 else if (reply == 'OK') {
      console.info('Auth Successfull');
    }
  });
}

client.on('connect', () => {
  console.info('Redis Connected Successfully');
});

client.on('error', () =>{
  console.info('Connection Error Reddis');
});

function get(key: string): any {
  try {
    return new Promise((resolve: any, reject: any) => {
      client.get(key, (err: any, res: any) => {
        if (err) {
          reject(err);
        }
 else if (res) {
          resolve(JSON.parse(res));
        }
        resolve(null);
      });
    });
  }
 catch (error) {
    // logger.logException( error, {key, value}, HIGH_SEVERITY, error.message, 'cache get', ERROR)
    console.log(error);
  }
}

function del(key: string): any {
  try {
    return new Promise((resolve: any, reject: any) => {
      client.exists(key, (err: any, res: any) => {
        if (res === 1) {
          // if key exists get value
          client.del(key, (err: any, res: any) => {
            if (err) {
              reject(err);
            }
 else if (res) {
              resolve(res);
            }
          });
        }
 else {
          resolve(null);
        }
      });
    });
  }
 catch (error) {
    console.log(error);
  }
}

function put(key: string, value: any, interval = 3600) {
  try {
    return new Promise((resolve, reject) => {
      client.set(key, JSON.stringify(value), 'EX', interval, (err: any, res: any) => {
        if (err) {
          reject(err);
        }
 else if (res == 'OK') {
          resolve(res);
        }
      });
    });
  }
 catch (error) {
    // logger.logException( error, {key, value, interval}, HIGH_SEVERITY, error.message, 'cache put', ERROR)
    console.log(error);
  }
}

export default {
  get,
  del,
  put,
};
