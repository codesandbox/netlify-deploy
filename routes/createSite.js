const { send, json } = require('micro');
const logger = require('../utils/logger');
const url = require('../utils/url');
const axios = require('axios');
const secrets = require('../secrets');

const createSite = async (req, res) => {
  const body = await json(req);
  try {
    const { data } = await axios.post(`${url}`, body, {
      headers: {
        Authorization: `Bearer ${secrets.netlifyToken}`,
      },
    });
    logger.log('info', 'Website created', data);
    send(res, 200, data);
  } catch (e) {
    logger.log('error', 'Could create website', { error: e.message, body });
    send(res, 500, 'There was an error creating your site');
  }
};
module.exports = createSite;
