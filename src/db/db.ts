const DB  = require('dynogels')

import CONFIG from '../config'
import { Messages } from '../message'

DB.AWS.config.update({     
  region: CONFIG.AWS_REGION
})

export = {
  DB,
  CONFIG,
  Messages
}