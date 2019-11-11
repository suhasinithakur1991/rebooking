import Router from 'koa-router';

import handler from './handler';
const { wrapHandlerModule } = require('./koaUtil');
const serverHandler = wrapHandlerModule(handler);
import authentication from './authentication';
import CONFIG from './config';
import { isValid } from './util';
const { ADMIN, AGENT, LEAD, BDM } = CONFIG.ROLES;

const router = new Router({ prefix: '/' });

router.get('refunds', authentication.isAuth, serverHandler.getRefund)

module.exports = router;
