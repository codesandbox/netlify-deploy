const { send, buffer } = require('micro')
const logger = require('../utils/logger')
const axios = require('axios')
const { NETLIFY_TOKEN } = process.env

const createDeploy = async (req, res) => {
  try {
    const body = await buffer(req)
    const siteId = req.query.siteId
    const buildDir = req.query.dist || 'build'
    const buildCommand = req.query.buildCommand
    const deployURL = await axios.post(
      `https://api-dev.netlify-services.com/builder/get-upload-url`,
      { siteId, buildDir, buildCommand: `npm run ${buildCommand}` },
      {
        headers: {
          Authorization: `bearer ${NETLIFY_TOKEN}`
        }
      }
    )
    logger('info', 'Got Deploy URL', deployURL.data)
    const upload = await axios.put(deployURL.data.uploadURL, body)
    logger('info', 'Pushed files to netlify', upload)

    const { data: status } = await axios.post(
      `https://api-dev.netlify-services.com/builder/build-status`,
      { siteId },
      {
        headers: {
          Authorization: `bearer ${NETLIFY_TOKEN}`
        }
      }
    )
    logger('info', 'Status Received', status)
    send(res, 200, {
      status: status
    })
  } catch (e) {
    logger('error', 'There was an error making your deploy', e)
    send(res, 500, 'There was an error creating your deploy')
  }
}

module.exports = createDeploy
