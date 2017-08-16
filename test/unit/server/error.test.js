const chai = require('chai')
const expect = chai.expect
const rp = require('request-promise')

const hapi = require('../../../server/hapi')

describe('[server] route /not/found', () => {
  before((done) => {
    hapi.start((error) => {
      if (error) {
        return done(error)
      }
      done()
    })
  })
  it('should respond 404', (done) => {
    rp({uri: 'http://localhost:4000/not/found', json: true}).then(() => {
      done('not good')
    }).catch((error) => {
      expect(error.statusCode).to.equal(404)
      done()
    })
  })
})
