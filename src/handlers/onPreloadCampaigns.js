import request from 'request'
import Debug from 'debug'

import Actions from '../GameActions'

const debug = Debug('gemboard-game:actions:onPreloadCampaigns')

const handler = (context) => {
  debug('request api/campaigns')
  context.setState({
    resources: true,
    progress: {
      title: 'Preloading game campaigns',
      message: 'Please wait...'
    }
  })
  request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    uri: process.env.REACT_APP_GEMBOARD_SERVER_URI + '/api/campaigns'
  }, (error, response, data) => {
    if (error) {
      debug('error %o', error)
    }
    if (response.statusCode === 200) {
      debug('campaigns loaded %o', data)
      context.setState({
        campaigns: data
      })
      Actions.preloadData()
    }
  })
}

export default handler
