const nconf = require('nconf')

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  env: nconf.get('NODE_ENV') || 'development',
  host: nconf.get('APPLICATION_HOST') || '0.0.0.0',
  port: nconf.get('APPLICATION_PORT') || 4000,
  uri: nconf.get('APPLICATION_URI') || 'http://localhost:4000'
}
