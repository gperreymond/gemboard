const handler = require('../../../../src/handlers/onUpdateCurrentTime').default

const chai = require('chai')
const expect = chai.expect

let context = {
  setState (state) {
  },
  state: {
    currentTime: false
  }
}

describe('[client] handler onUpdateCurrentTime', () => {
  it('should get current time', (done) => {
    handler(context)
    expect(context.state.currentTime).not.equal(false)
    done()
  })
})
