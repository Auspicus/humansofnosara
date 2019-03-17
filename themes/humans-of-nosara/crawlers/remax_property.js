module.exports = async (page) => {
  const properties = []
  let result = {
    data: null,
    next: 'https://www.remax-tresamigos-cr.com/properties?items_per_page=75'
  }

  while (result.next) {
    console.log('Navigating to ', result.next)

    await page.goto(result.next, {
      waitUntil: 'load',
      timeout: 0
    })

    result = await page.evaluate(() => {
      const data = []
  
      document.querySelectorAll('.view-id-real_estate_property_list .views-column').forEach(node => {
        try {
          data.push({
            uid: 'remax_property_',
            name: node.querySelector('.views-field-title .field-content a').innerHTML.trim(),
            location: { name: node.querySelector('.views-field-field-location .field-content').innerHTML.trim(), geo: null },
            images: [node.querySelector('.views-field-property-photo .field-content img').src],
            price: parseInt(node.querySelector('.views-field-property-price .field-content').innerHTML.trim().replace(/\$/g, '').replace(/,/g, '')),
            url: node.querySelector('.views-field-title .field-content a').href
          })
        } catch (error) {
          return { error }
        }
      })

      return {
        error: null,
        data: data.map(item => ({ ...item, location: { ...item.location, name: item.location.name === 'Other' ? null : item.location.name } })),
        next: document.querySelector('.pager-next a') ? document.querySelector('.pager-next a').href : null
      }
    })

    if (result.error) {
      throw result.error
    }

    properties.push.apply(properties, result.data)
  }

  return properties.map((property, i) => ({ ...property, uid: property.uid + i }))
}