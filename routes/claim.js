const jwt = require('jsonwebtoken');
const { send } = require('micro');
const logger = require('../utils/logger');
const secrets = require('../secrets');

const claimSite = async (req, res) => {
  const { sessionId } = req.query;
  const token = jwt.sign(
    {
      client_id: secrets.netlifyOAuthClientId,
      session_id: sessionId,
    },
    secrets.netlifyOAuthClientSecret
  );
  logger.log('info', 'Got User Token');
  send(res, 200, {
    sessionId,
    claim: `https://app.netlify.com/claim#${token}`,
  });
};

module.exports = claimSite;
