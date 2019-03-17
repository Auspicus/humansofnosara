const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const { validate } = require('./validator')
const sourcesObject = require('./sources')

const entityTypes = require('./entity_types.json')

const getCacheItem = (cid) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '/static/data/', cid), (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const setCacheItem = (cid, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, '/static/data/', cid), JSON.stringify(data), (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

(async () => {
  const sourcesArray = Object.keys(sourcesObject).map(key => ({ id: key, ...sourcesObject[key] }))
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let i = 0; i < sourcesArray.length; i++) {
    const source = sourcesArray[i]
    const entityType = entityTypes.entity_types.filter(entityType => entityType.id === source.entity_type).shift()

    try {
      await getCacheItem(source.cid)
      console.log(`Found source: ${source.id} @ ${source.cid}`)
    } catch (err) {
      try {
        const data = await require(`./crawlers/${source.id}.js`)(page)
        const errors = validate(data, entityType)

        if (errors.length === 0) {
          await setCacheItem(source.cid, { data, type: source.entity_type, name: source.name })
          console.log(`Cached source: ${source.id} @ ${source.cid}`)
        } else {
          console.error(`Validation errors found in source: ${source.id}`)
        }
      } catch (err) {
        console.error(`Couldn't find source function for ${source.id}`, '\n', err)
      }
    }
  }

  await browser.close()
})()