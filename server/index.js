const hapi = require('./hapi')

hapi.start((error) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }
  console.log('Server running at:', hapi.info.uri)
})
