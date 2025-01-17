const log = require('migrate/lib/log')

const { createStoreFactory } = require('../store')

const rewriteMigration = async (spaceId, environmentId, accessToken, httpsAgent, files) => {
  const factory = await createStoreFactory({ accessToken, environmentId, spaceId, httpsAgent })

  return Promise.all(files.map((file) => {
    const contentType = file.contentTypeId
    const set = {
      lastRun: file.fileName,
      migrations: [{
        title: file.fileName,
        timestamp: Date.now(),
        description: `Create content model for ${contentType}`
      }]
    }
    const store = factory.newStore(contentType)
    return store.writeState(set)
      .then(() => log('Wrote contentful migration state', contentType))
  }))
}

module.exports = rewriteMigration
