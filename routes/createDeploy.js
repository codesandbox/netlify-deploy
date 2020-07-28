const { send, buffer } = require('micro');
const logger = require('../utils/logger');
const axios = require('axios');
const secrets = require('../secrets');

const createDeploy = async (req, res) => {
  try {
    const body = await buffer(req);
    const siteId = req.query.siteId;
    const buildDir = req.query.dist || 'build';
    const buildCommand = req.query.buildCommand;
    const deployURL = await axios.post(
      `https://r0ovnvtqqi.execute-api.eu-west-1.amazonaws.com/dev/get-upload-url`,
      { siteId, buildDir, buildCommand: `npm run ${buildCommand}` },
      {
        headers: {
          Authorization: `bearer ${secrets.netlifyToken}`,
        },
      }
    );
    logger.log('info', 'Got Deploy URL', deployURL.data);
    await axios.put(deployURL.data.uploadURL, body);
    logger.log('info', 'Pushed files to netlify');

    const { data: status } = await axios.post(
      `https://r0ovnvtqqi.execute-api.eu-west-1.amazonaws.com/dev/build-status`,
      { siteId },
      {
        headers: {
          Authorization: `bearer ${secrets.netlifyToken}`,
        },
      }
    );
    logger.log('info', 'Status Received', status);
    send(res, 200, {
      status: status,
    });
  } catch (e) {
    logger.log('error', 'There was an error making your deploy', {
      error: e.message,
    });
    send(res, 500, 'There was an error making your deploy');
  }
};

module.exports = createDeploy;
