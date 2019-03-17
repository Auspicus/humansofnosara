module.exports = async (page) => {
  await page.goto('https://www.humansofnosara.org/donate/')

  const charities = await page.evaluate(() => {
    const data = []
    document.querySelectorAll('.feature-cta').forEach(node => {
      data.push({
        uid: 'hon_charity_' + data.length,
        name: node.querySelector('.feature-cta__button').innerHTML.trim(),
        image: node.querySelector('.feature-cta__background').style.backgroundImage.replace('url("', '').replace('")', ''),
        location: { name: 'Nosara', geo: null },
        url: node.querySelector('.feature-cta__content-link').href
      })
    })
    return data
  })

  return charities
}