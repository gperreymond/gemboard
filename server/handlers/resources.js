const path = require('path')
const glob = require('glob')
const eraro = require('eraro')({package: 'warboard'})
const Boom = require('boom')
const Promise = require('bluebird')
const camelCase = require('lodash.camelcase')

const config = require('../../config/default')

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
      images: getResource('../../data/resources/images', config.uri + '/data/resources/images'),
      musics: getResource('../../data/resources/musics', config.uri + '/data/resources/musics'),
      sounds: getResource('../../data/resources/sounds', config.uri + '/data/resources/sounds')
    }).then(result => {
      return reply({
        images: result.images,
        musics: result.musics,
        sounds: result.sounds
      })
    }).catch(error => {
      return reply(error)
    })
  }
}
