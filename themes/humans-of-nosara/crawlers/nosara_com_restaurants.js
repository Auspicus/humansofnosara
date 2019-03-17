module.exports = async (page) => {
  const restaurants = []
  let result = {
    data: null,
    next: 'https://www.nosara.com/restaurants/'
  }

  while (result.next) {
    console.log('Navigating to ', result.next)

    await page.goto(result.next, {
      waitUntil: 'load',
      timeout: 0
    })

    result = await page.evaluate(() => {
      const data = []
  
      document.querySelectorAll('#activityGuide .column').forEach(node => {
        const tableRows = node.querySelectorAll('tr')

        let location = null
        tableRows.forEach(row => {
          if (row.innerHTML.indexOf('Location:') > -1)
            location = row.querySelector('td:nth-child(2)').innerHTML.trim()
        })

        let phone = null
        tableRows.forEach(row => {
          if (row.innerHTML.indexOf('Phone:') > -1)
            phone = row.querySelector('td:nth-child(2)').innerHTML.trim()
        })

        try {
          data.push({
            uid: 'nosara_com_restaurants_',
            name: node.querySelector('h2').textContent.trim(),
            location: { name: location, geo: null },
            phone,
            image: node.querySelector('img').src,
            url: node.querySelector('.btn_showmore').href
          })
        } catch (error) {
          return { error }
        }
      })

      return {
        error: null,
        data,
        next: document.querySelector('#pagination .next a') ? document.querySelector('#pagination .next a').href : null
      }
    })

    if (result.error) {
      throw result.error
    }

    restaurants.push.apply(restaurants, result.data)
  }

  return restaurants.map((restaurant, i) => ({ ...restaurant, uid: restaurant.uid + i }))
}