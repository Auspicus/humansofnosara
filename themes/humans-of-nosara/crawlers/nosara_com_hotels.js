module.exports = async (page) => {
  const hotels = []
  let result = {
    data: null,
    next: 'https://www.nosara.com/hotels/'
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
            uid: 'nosara_com_hotels_',
            name: node.querySelector('h2').innerHTML.trim(),
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

    hotels.push.apply(hotels, result.data)
  }

  return hotels.map((hotel, i) => ({ ...hotel, uid: hotel.uid + i }))
}