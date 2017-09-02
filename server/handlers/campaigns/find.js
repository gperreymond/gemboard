const path = require('path')
const glob = require('glob')
const YAML = require('yamljs')

module.exports = {
  auth: false,
  handler (request, reply) {
    const dirpath = path.resolve(__dirname, '../../../data/tables/campaigns')
    const patternPath = dirpath + '/**/*.yml'
    const patternFiles = glob.sync(patternPath, {
      nodir: true,
      dot: true
    })
    return reply({
      count: patternFiles.length,
      dataProvider: patternFiles.map((file) => {
        return YAML.load(file)
      })
    })
  }
}
