exports.endpoints = [

  { method: 'GET', path: '/api/alive', config: require('./handlers/alive') },
  { method: 'GET', path: '/api/resources', config: require('./handlers/resources/find') },
  { method: 'GET', path: '/api/cards', config: require('./handlers/cards/find') },
  { method: 'GET', path: '/api/campaigns', config: require('./handlers/campaigns/find') }

]
