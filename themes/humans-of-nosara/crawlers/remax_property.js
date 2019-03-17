module.exports = async (page) => {
  const properties = []
  let result = {}

  do {
    await page.goto(result.next || 'https://www.remax-tresamigos-cr.com/properties', {
      waitUntil: 'load',
      timeout: 0
    })

    result = await page.evaluate(() => {
      const data = []
  
      document.querySelectorAll('.view-id-real_estate_property_list .views-column').forEach(node => {
        try {
          data.push({
            uid: 'remax_property_' + data.length,
            name: node.querySelector('.views-field-title .field-content a').innerHTML.trim(),
            location: { name: node.querySelector('.views-field-field-location .field-content').innerHTML.trim(), geo: null },
            images: [node.querySelector('.views-field-property-photo .field-content img').src],
            price: parseInt(node.querySelector('.views-field-property-price .field-content').innerHTML.trim().replace(/\$/g, '').replace(/,/g, '')),
            url: node.querySelector('.views-field-title .field-content a').href
          })
        } catch (err) {
          console.error(err)
        }
      })

      return {
        data: data.map(item => ({ ...item, location: { ...item.location, name: item.location.name === 'Other' ? null : item.location.name } })),
        next: document.querySelector('.pager-next a') ? document.querySelector('.pager-next a').href : null
      }
    })

    properties.push.apply(properties, result.data)
  } while (result.next)

  return properties
}