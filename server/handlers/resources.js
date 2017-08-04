const path = require('path')
const glob = require('glob')
const eraro = require('eraro')({package: 'warboard'})
const Boom = require('boom')
const Promise = require('bluebird')
const camelCase = require('lodash.camelcase')

const getResource = (pattern, uri) => {
  return new Promise((resolve, reject) => {
    glob(path.resolve(__dirname, pattern, '*.*'), {}, (error, files) => {
      if (error) {
        reject(Boom.badRequest(eraro('400', 'BAD_REQUEST', error)))
      } else {
        let resources = {}
        files.map(file => {
          let fname = camelCase(path.basename(file, path.extname(file)))
          resources[fname] = uri + '/' + path.basename(file)
        })
        resolve(resources)
      }
    })
  })
}

module.exports = {
  auth: false,
  handler (request, reply) {
    Promise.props({
      images: getResource('../../data/resources/images', request.server.info.uri + '/data/resources/images'),
      sounds: getResource('../../data/resources/sounds', request.server.info.uri + '/data/resources/sounds')
    }).then(result => {
      return reply({
        images: result.images,
        sounds: result.sounds
      })
    }).catch(error => {
      return reply(error)
    })
  }
}
