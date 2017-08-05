import request from 'request'
import Debug from 'debug'

import Actions from '../Actions'

const debug = Debug('gemboard-game:actions:onInitialize')

const handler = (context) => {
  debug('handler')
  context.state.progress.text = 'Chargement des data...'
  context.setState({progress: context.state.progress})
  request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    uri: window.location.origin + '/api/resources'
  }, (error, response, body) => {
    if (error) {
      debug('ERROR %o', error)
    }
    if (response.statusCode === 200) {
      debug('data loaded %o', body)
      context.setState({data: body})
      Actions.initializeGame()
    }
  })
}

export default handler
