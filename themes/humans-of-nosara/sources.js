/**
 * @file source.js
 * 
 * source.js contains all data sources.
 * 
 * Each data source declares:
 *   - `type` - source type
 *   - `source` - a function which returns data
 *   - `cid` - cache ID
 * 
 * Source types include:
 *   - `csv`
 *   - `crawler`
 * 
 * The `source` function is run when no cache item is found and should return
 * a list of items which will map to the `data` parameter in the cache file.
 */

// const fs = require('fs')
// const path = require('path')

// const parseCSV = (absoluteFilePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(absoluteFilePath, (err, data) => {
//       if (err) reject(err)
//       else resolve(data)
//     })
//   })
// }

module.exports = {
  sn_property: {
    /**
     * Type of source
     */
    type: 'crawler',

    /**
     * Type of entity
     */
    entity_type: 'real_estate',
    name: ['Real Estate', 'Property', 'Properties'],
    
    /**
     * Cache ID
     */
    cid: 'sn_property.json',
  },

  c21_property: {
    type: 'crawler',
    entity_type: 'real_estate',
    name: ['Real Estate', 'Property', 'Properties'],
    cid: 'c21_property.json',
  },

  remax_property: {
    type: 'crawler',
    entity_type: 'real_estate',
    name: ['Real Estate', 'Property', 'Properties'],
    cid: 'remax_property.json',
  },

  ves_graduate: {
    type: 'crawler',
    entity_type: 'person',
    name: ['People', 'Person'],
    cid: 'ves_graduate.json'
  },

  hon_interviewee: {
    type: 'crawler',
    entity_type: 'person',
    name: ['People', 'Person'],
    cid: 'hon_interviewee.json'
  },

  hon_charity: {
    type: 'crawler',
    entity_type: 'charity',
    name: ['Charity', 'Charities'],
    cid: 'hon_charity.json'
  },
}