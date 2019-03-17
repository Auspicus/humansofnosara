module.exports = async (page) => {
  await page.goto('https://www.humansofnosara.org/')

  const interviewee = await page.evaluate(() => {
    const data = []
    const capitalize = str => str.split(' ').map(substr => `${substr.slice(0, 1).toUpperCase()}${substr.slice(1)}`).join(' ')
    document.querySelectorAll('.article-teaser').forEach(node => {
      try {
        data.push({
          uid: 'hon_interviewee_' + data.length,
          name: capitalize(node.querySelector('a').href.replace('https://www.humansofnosara.org/human/', '').replace(/-/g, ' ').replace(/\//g, '')),
          image: node.querySelector('.article-teaser__image').src,
          location: { name: 'Nosara', geo: null },
          phone: null,
          email: null
        })
      } catch (err) {
        data.push(err.toString())
      }
    })
    return data
  })

  return interviewee
}