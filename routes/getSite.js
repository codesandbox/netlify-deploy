const { send } = require('micro');
const logger = require('../utils/logger');
const url = require('../utils/url');
const axios = require('axios');
const secrets = require('../secrets');

const getSite = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${url}/csb-${req.params.id}.netlify.com`,
      {
        headers: {
          Authorization: `Bearer ${secrets.netlifyToken}`,
        },
      }
    );

    logger.log('info', 'Got Website', { site: req.params.id });
    send(res, 200, {
      id: data.id,
      site_id: data.site_id,
      screenshot_url: data.screenshot_url,
      name: data.name,
      url: data.url,
      state: data.state,
      sandboxId: req.params.id,
    });
  } catch (e) {
    logger.log('error', 'Could not find website', {
      site: req.params.id,
      error: e.message,
    });
    send(res, 404, { error: 'Not Found' });
  }
};

module.exports = getSite;
