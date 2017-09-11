import request from 'request'
import Debug from 'debug'

import Actions from '../GameActions'

const debug = Debug('gemboard-game:actions:onPreloadCards')

const handler = (context) => {
  debug('request api/cards')
  context.setState({
    resources: true,
    progress: {
      title: 'Preloading game cards',
      message: 'Please wait...'
    }
  })
  request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    uri: process.env.REACT_APP_GEMBOARD_SERVER_URI + '/api/cards'
  }, (error, response, data) => {
    if (error) {
      debug('error %o', error)
    }
    if (response.statusCode === 200) {
      debug('cards loaded %o', data)
      context.setState({
        cards: data
      })
      Actions.preloadCampaigns()
    }
  })
}

export default handler
