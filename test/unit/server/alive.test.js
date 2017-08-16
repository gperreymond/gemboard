const chai = require('chai')
const expect = chai.expect
const rp = require('request-promise')

const hapi = require('../../../server/hapi')

describe('[server] route /api/alive', () => {
  before((done) => {
    hapi.start((error) => {
      if (error) {
        return done(error)
      }
      done()
    })
  })
  it('should respond 200', (done) => {
    rp({uri: 'http://localhost:4000/api/alive', json: true}).then((result) => {
      expect(result.alive).to.equal(true)
      done()
    }).catch(done)
  })
})
