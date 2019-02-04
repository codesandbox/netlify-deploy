require('dotenv').config()

const { send, json, buffer } = require('micro')
const { router, get, post } = require('microrouter')
const axios = require('axios')
const microCors = require('micro-cors')

const cors = microCors()

const url = `https://api.netlify.com/api/v1/sites/`
const token = process.env.NETLIFY_TOKEN

const getSite = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${url}/csb-${req.params.id}.netlify.com`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    send(res, 200, {
      id: data.id,
      screenshot_url: data.screenshot_url,
      name: data.name,
      url: data.url,
      state: data.state,
      sandboxId: req.params.id
    })
  } catch (e) {
    const statusCode = 404
    const data = { error: 'Not Found' }

    send(res, statusCode, data)
  }
}

const createSite = async (req, res) => {
  const body = await json(req)
  try {
    const site = await axios.post(`${url}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    send(res, 200, {
      created: true
    })
  } catch (e) {
    console.log('error', e)
    send(res, 500, 'error')
  }
}

const createDeploy = async (req, res) => {
  try {
    const body = await buffer(req)
    const id = `csb-${req.params.id}`
    const { data } = await axios.post(
      `${url}/${id}.netlify.com/deploys`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/zip'
        }
      }
    )

    send(res, 200, {
      id: data.id,
      screenshot_url: data.screenshot_url,
      name: data.name,
      url: data.url,
      state: data.state,
      deploy_url: data.deploy_url
    })
  } catch (e) {
    console.log('error', e)
    send(res, 500, 'error')
  }
}

module.exports = cors(
  router(
    post('/site/:id/deploys', createDeploy),
    get('/site/:id', getSite),
    post('/site', createSite)
  )
)
