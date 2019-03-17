module.exports = async (page) => {
  await page.goto('https://www.viveelsuenocr.org/participant/')

  const graduates = await page.evaluate(() => {
    const data = []
    document.querySelectorAll('.participant__teaser').forEach(participantTeaser => {
      data.push({
        uid: 'ves_graduate_' + data.length,
        name: participantTeaser.querySelector('.participant__teaser-title').innerHTML.trim(),
        image: participantTeaser.querySelector('.participant__teaser-image').getAttribute('data-src'),
        location: { name: 'Nosara', geo: null },
        phone: participantTeaser.querySelector('.participant__teaser-phone').innerHTML.trim(),
        email: null
      })
    })
    return (
      data
      .filter(item => item.name.indexOf('&') === -1)
      .map(item => ({
        ...item,
        phone: item.phone === 'Unavailable' ? null : item.phone
      }))
    )
  })

  return graduates
}