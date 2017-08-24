import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onResolveClusters')

const handler = (context) => {
  debug('resolve the clusters')
  Actions.findClusters()
}

export default handler
