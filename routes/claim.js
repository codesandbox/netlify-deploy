const jwt = require('jsonwebtoken')
const { send } = require('micro')
const logger = require('../utils/logger')
const { NETLIFY_OAUTH_CLIENT_ID, NETLIFY_OAUTH_CLIENT_SECRET } = process.env

const claimSite = async (req, res) => {
  const { sessionId } = req.query
  const token = jwt.sign(
    {
      client_id: NETLIFY_OAUTH_CLIENT_ID,
      session_id: sessionId
    },
    NETLIFY_OAUTH_CLIENT_SECRET
  )
  logger('info', 'Got User Token')
  send(res, 200, {
    sessionId,
    claim: `https://app.netlify.com/claim#${token}`
  })
}

module.exports = claimSite
