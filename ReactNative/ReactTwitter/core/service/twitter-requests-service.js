var OauthHelper = require('../service/oauth-helper.js')

const CONSUMER_KEY = 'aqPSTs1FT2ndP7qXi247BtbXd'
const CONSUMER_SECRET = 'pTvKlESMnsmc7DqP70CfmJypGgk9oaHPxgC7DkUVbxVZXtIGp6'

const BASE_URL = 'https://api.twitter.com'
const REQUEST_TOKEN = '/oauth/request_token'
const CALLBACK_URL = 'react-twitter-oauth://callback'

class TwitterRequestsService {

  requestToken () {
    let ouathHelper = new OauthHelper(CONSUMER_SECRET)
    let time = new Date().getTime() / 1000 | 0
    let nonce = OauthHelper.generateNonce()
    let url = BASE_URL + REQUEST_TOKEN
    const params = {
      'oauth_callback': CALLBACK_URL,
      'oauth_consumer_key': CONSUMER_KEY,
      'oauth_nonce': nonce,
      'oauth_signature_method': 'HMAC-SHA1',
      'oauth_timestamp': time,
      'oauth_version': '1.0'
    }

    return fetch(url, // eslint-disable-line no-undef
      {
        method: 'POST',
        headers: {
          'Authorization': ouathHelper.buildAuthorizationHeader('post', url, params, '')
        }
      })
    .then((response) => { return response.text() })
    .then((text) => { return this._getTokenDateFromResponse(text) })
    .catch((error) => {
      console.warn(error)
    })
  }

  _getTokenDateFromResponse (response) {
    let result = {}
    let data = response.split('&')
    data.forEach((pair) => {
      let pairValues = pair.split('=')
      result[pairValues[0]] = pairValues[1]
    })
    return result
  }
}

module.exports = TwitterRequestsService
