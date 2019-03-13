const { send } = require('micro')
const logger = require('../utils/logger')
const axios = require('axios')
const { NETLIFY_TOKEN } = process.env

const getStatus = async (req, res) => {
  const siteId = req.params.id
  try {
    const { data: status } = await axios.post(
      `https://r0ovnvtqqi.execute-api.eu-west-1.amazonaws.com/dev/build-status`,
      { siteId },
      {
        headers: {
          Authorization: `bearer ${NETLIFY_TOKEN}`
        }
      }
    )
    logger.log('info', 'Status Received', status)
    send(res, 200, {
      status
    })
  } catch (e) {
    logger.log('error', 'Could not get Status', e)
    send(res, 500, 'There was an error creating your deploy')
  }
}

module.exports = getStatus
