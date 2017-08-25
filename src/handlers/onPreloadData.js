import request from 'request'
import Debug from 'debug'

const PIXI = require('pixi.js')

const debug = Debug('gemboard-game:actions:onPreloadData')

const handler = (context) => {
  debug('request api/resources')
  context.setState({
    resources: true,
    progress: {
      title: 'Preloading game data',
      message: 'Please wait...'
    }
  })
  request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    uri: window.location.origin + '/api/resources'
  }, (error, response, data) => {
    if (error) {
      debug('error %o', error)
    }
    if (response.statusCode === 200) {
      debug('data loaded %o', data)
      // prepare game data loader
      Object.keys(data).map(type => {
        Object.keys(data[type]).map(key => {
          PIXI.loader.add(key, data[type][key])
          return key
        })
        return type
      })
      // execute game data loader
      PIXI.loader.on('progress', (loader, resource) => {
        // debug('load in progress %s', resource.name)
        context.setState({progress: {
          title: 'Preloading game data',
          message: 'Progress: ' + Math.round(loader.progress) + '%'
        }})
      })
      PIXI.loader.load((loader, resources) => {
        debug('load is complete')
        context.setState({
          currentState: 'STATE_HOMEPAGE',
          stage: context.state.engine.stage,
          resources,
          progress: {
            title: '...',
            message: '...'
          }
        })
      })
    }
  })
}

export default handler
