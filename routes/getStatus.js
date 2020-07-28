const { send } = require('micro');
const logger = require('../utils/logger');
const axios = require('axios');
const secrets = require('../secrets');

const getStatus = async (req, res) => {
  const siteId = req.params.id;
  try {
    const { data: status } = await axios.post(
      `https://r0ovnvtqqi.execute-api.eu-west-1.amazonaws.com/dev/build-status`,
      { siteId },
      {
        headers: {
          Authorization: `bearer ${secrets.netlifyToken}`,
        },
      }
    );
    send(res, 200, {
      status,
    });
  } catch (e) {
    logger.log('error', 'Could not get Status', e.message);
    send(res, 500, 'There was an error creating your deploy');
  }
};

module.exports = getStatus;
