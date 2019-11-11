const readline = require('readline');
const shell = require('shelljs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const variables = {
  stage: process.env.NODE_ENV,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  sessionKey: process.env.SESSION_KEY,
  flightUrl: process.env.FLIGHT_URL,
  userUrl: process.env.USER_URL,
  websiteUrl: process.env.WEBSITE_URL,
  walletUrl: process.env.WALLET_URL,
  paymentUrl: process.env.PAYMENT_URL,
  supportUrl: process.env.SUPPORT_URL,
  hotelUrl: process.env.HOTEL_URL,
  busUrl: process.env.BUS_URL,
  busesServerUrl: process.env.BUSES_SERVER_URL,
  sessionKeyName: process.env.SESSION_KEY_NAME,
  cabUrl: process.env.CAB_URL,
  host: process.env.HOST
};

function getEnvVariables() {
  const keyValue = Object.keys(variables).map((key) => {
    return `--${key} ${variables[key]}`;
  });

  console.log(variables);
  rl.question('echo Please check the variables and type confirm to proceed: ', (answer) => {
    if (answer === 'confirm') {
      if (variables.stage === 'production' || variables.stage === 'uat') {
        rl.question('Are you sure you want to deploy on production/uat (yes/no)? ', (answer) => {
          if (answer === 'yes') {
            shell.exec('echo deploying on production/uat');
            shell.exec(`sls deploy ${keyValue.join(' ')}`).output;
          }
          rl.close();
        });
      }
 else {
        shell.exec(`sls deploy ${keyValue.join(' ')}`).output;
      }
      console.log('done');
    }
 else {
      shell.exec('echo aborted');
    }
  });
}

getEnvVariables();
