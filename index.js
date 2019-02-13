require('dotenv').config()

const { send, json, buffer } = require('micro')
const { router, get, post } = require('microrouter')
const axios = require('axios')
const microCors = require('micro-cors')
const jwt = require('jsonwebtoken')

const cors = microCors()

const url = `https://api.netlify.com/api/v1/sites/`
const {
  NETLIFY_OAUTH_CLIENT_ID,
  NETLIFY_OAUTH_CLIENT_SECRET,
  NETLIFY_TOKEN
} = process.env

const getSite = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${url}/csb-${req.params.id}.netlify.com`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`
        }
      }
    )

    send(res, 200, {
      id: data.id,
      site_id: data.site_id,
      screenshot_url: data.screenshot_url,
      name: data.name,
      url: data.url,
      state: data.state,
      sandboxId: req.params.id
    })
  } catch (e) {
    send(res, 404, { error: 'Not Found' })
  }
}

const createSite = async (req, res) => {
  const body = await json(req)
  try {
    const { data } = await axios.post(`${url}`, body, {
      headers: {
        Authorization: `Bearer ${NETLIFY_TOKEN}`
      }
    })

    send(res, 200, data)
  } catch (e) {
    console.log('error', e)
    send(res, 500, 'There was an error creating your site')
  }
}

const createDeploy = async (req, res) => {
  try {
    const body = await buffer(req)
    const siteId = req.query.siteId
    const id = `csb-${req.params.id}`
    const deployURL = await axios.post(
      `https://api-dev.netlify-services.com/builder/get-upload-url`,
      { siteId },
      {
        headers: {
          Authorization: `bearer ${NETLIFY_TOKEN}`
        }
      }
    )
    const url = deployURL.data.uploadURL

    const upload = await axios.put(deployURL.data.uploadURL, body)

    const { data: status } = await axios.post(
      `https://api-dev.netlify-services.com/builder/build-status`,
      { siteId },
      {
        headers: {
          Authorization: `bearer ${NETLIFY_TOKEN}`
        }
      }
    )

    send(res, 200, {
      status: status.status
    })
  } catch (e) {
    console.log('error', e)
    send(res, 500, 'There was an error creating your deploy')
  }
}

const claimSite = async (req, res) => {
  const { sessionId } = req.query
  const token = jwt.sign(
    {
      client_id: process.env.NETLIFY_OAUTH_CLIENT_ID,
      session_id: sessionId
    },
    process.env.NETLIFY_OAUTH_CLIENT_SECRET
  )

  send(res, 200, {
    sessionId,
    claim: `https://app.netlify.com/claim#${token}`
  })
}

module.exports = cors(
  router(
    post('/site/:id/deploys', createDeploy),
    get('/site/:id', getSite),
    get('/site-claim', claimSite),
    post('/site', createSite)
  )
)
