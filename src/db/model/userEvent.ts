import * as joi from 'joi'
import { validMessage } from '../../message'
import CONFIG from '../../config';

export const userEvent = {
    request:joi.object().allow(null).options(validMessage('request')), 
    userId: joi.string().required().required().options(validMessage('userId')),
    product: joi.string().required().required().options(validMessage('product')),
    activity: joi.string().required().required().valid(CONFIG.VALID_EVENT_TYPES).options(validMessage('activity')),
    sessionId: joi.string().required().allow(null).options(validMessage('sessionId')),
    cronActivityDate: joi.date().allow(null).options(validMessage('cronActivityDate')),
    cronActivityState: joi.string().required().allow(null).options(validMessage('cronActivityState')),
    event : joi.string().required().allow(null).options(validMessage('event')),
    isEnabled : joi.number().default(1).required().valid(CONFIG.IS_ENABLED).options(validMessage('is enabled')) 
}

