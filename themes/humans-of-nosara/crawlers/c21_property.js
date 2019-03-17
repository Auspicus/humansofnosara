module.exports = async (page) => {
  await page.goto('https://century21nosara.com/nosara-real-estate-listings/', {
    waitUntil: 'load',
    timeout: 0
  })

  const properties = await page.evaluate(() => {
    const data = []
    document.querySelectorAll('.property-item-wrapper').forEach(node => {
      try {
        data.push({
          uid: 'c21_property_' + data.length,
          name: node.querySelector('h4 a').innerHTML.trim(),
          location: { name: 'Nosara', geo: null },
          images: [node.querySelector('.attachment-property-thumb-image').src],
          price: parseInt(node.querySelector('.price').innerHTML.split('<small>').shift().trim().replace(/\$/g, '').replace('.00', '').replace(/,/g, '')),
          url: node.querySelector('h4 a').href
        })
      } catch (err) {}
    })
    return data
  })

  return properties
}