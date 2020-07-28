require('dotenv').config();
const { router, get, post } = require('microrouter');
const { send } = require('micro');
const logger = require('./utils/logger');
const microCors = require('micro-cors');
const claimSite = require('./routes/claim');
const getSite = require('./routes/getSite');
const createSite = require('./routes/createSite');
const createDeploy = require('./routes/createDeploy');
const getStatus = require('./routes/getStatus');
const cors = microCors();

module.exports = cors(
  router(
    get('/healthz', (req, res) => {
      logger.log('info', 'All Good');
      send(res, 200, { ok: true });
    }),
    post('/site/:id/deploys', createDeploy),
    get('/site/:id/status', getStatus),
    get('/site/:id', getSite),
    get('/site-claim', claimSite),
    post('/site', createSite)
  )
);
