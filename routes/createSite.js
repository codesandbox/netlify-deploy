const { send, json } = require('micro')
const logger = require('../utils/logger')
const url = require('../utils/url')
const axios = require('axios')
const { NETLIFY_TOKEN } = process.env

const createSite = async (req, res) => {
  const body = await json(req)
  try {
    const { data } = await axios.post(`${url}`, body, {
      headers: {
        Authorization: `Bearer ${NETLIFY_TOKEN}`
      }
    })
    logger.log('info', 'Website created', data)
    send(res, 200, data)
  } catch (e) {
    logger.log('error', 'Could create website', e)
    send(res, 500, 'There was an error creating your site')
  }
}
module.exports = createSite
