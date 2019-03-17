const search = require('js-search')
const preact = require('preact')
const h = preact.h
const Component = preact.Component

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = { query: '' }
    this.search = new search.Search('uid')
    this.onChange = this.onChange.bind(this)
  }

  getKey(item, key) {
    let root = item
    const parts = key.split('.')
    while (parts.length) {
      root = root[parts.shift()]
    }
    return root
  }

  createFacets(entityTypes) {
    // Store all searchable values
    const facets = []

    // Loop through each entity and collect searchable values
    return facets
  }

  normalizeEntities(entityTypes) {
    const normalizers = {
      'name': data => data,
      'phone': data => data && data.replace(/(\(*-*\)*\s*)/g, ''),
      'location.name': data => data
    }
    const data = {}

    entityTypes.forEach(entityType => {
      // Create the index for this entity type
      data[entityType.type] = data[entityType.type] || {}

      // Fill the index with each unique entity
      entityType.data.forEach(entity => {
        data[entityType.type][entity.uid] = entity
      })
    })

    return data
  }

  componentDidMount() {
    this
    .load()
    .then(entityTypes => {

    })
  }

  onChange(event) {
    this.setState({ query: event.target.value })
  }

  load() {
    return Promise.all([
      '/data/c21_property.json',
      '/data/hon_charity.json',
      '/data/hon_interviewee.json',
      '/data/ves_graduate.json',
      '/data/remax_property.json'
    ].map(async data => {
      const response = await fetch(data)
      return await response.json()
    }))
  }

  dedupe(arr, key) {
    return arr.filter((o, i, arr) => arr.findIndex(t => t[key] === o[key]) === i)
  }

  itemFromUID(uid) {
    const parts = uid.split(':')
    const entityType = parts.shift()
    const entityId = parts.shift()

    return this.state.data[entityType][entityId]
  }

  query(n) {
    const multi = this.state.query.split(' ')
    const occurences = {}
    const results = []
    
    while (multi.length) {
      const next = multi.shift()
      results.push.apply(
        results,
        this
        .state
        .facets
        .filter(f => f.key.toLowerCase().indexOf(next) > -1)
      )
    }

    // Create a map to sort results by # of matches
    results
    .forEach(result => {
      occurences[result.uid] = occurences[result.uid] || 0
      occurences[result.uid]++
    })

    return (
      this
      .dedupe(
        results
        .filter(item => occurences[item.uid] > multi.length)
        .sort((a, b) => occurences[b.uid] - occurences[a.uid]),
        'uid'
      )
      .map(item => { console.log(item); return item; })
      .slice(0, n)
      .map(result => this.itemFromUID(result.uid))
    )
  }

  render() {
    const results = this.state.query ? this.query(25).map(item => {
      const src = !!item.image
        ? item.image
        : !!item.images
          ? item.images[0]
          : null
      const href = !!item.url
        ? item.url
        : null
      const phone = !!item.phone
        ? item.phone
        : null
      const price = !!item.price
        ? item.price
        : null
      const location = !!item.location
        ? item.location
        : null
      const locationName = !!location
        ? location.name
        : null

      return (
        h('div', { className: 'search__result' }, 
          h('a', { href, target: '_blank' }, [
            src ? h('div', { className: 'search__image', style: { backgroundImage: `url(${src})` } }) : null,
            price
              ? h('div', { className: 'search__price' }, `$${Number(price).toLocaleString()}`)
              : null,
            h('h3', null, item.name),
            phone
              ? href
                ? h('div', { className: 'search__phone' }, phone)
                : h('a', { href: `tel:${phone}` }, h('div', { className: 'search__phone' }, phone))
              : null,
            locationName
              ? h('div', { className: 'search__location' }, locationName)
              : null,
          ])
        )
      )
    }) : null

    return (
      h('div', null, [
        h('div', { className: 'field search__field '}, [
          h('svg', { className: 'search__icon', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20' }, [ h('path', { d: 'M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z' }) ]),
          h('input', { value: this.state.query, className: 'field__input', id: 'search', type: 'text', name: 'search', placeholder: 'What are you looking for?', onInput: this.onChange })
        ]),
        !this.state.query ? h('div', { className: 'search__suggestions' }, 'You could try looking for people, properties or charities.') : null,
        h('div', { className: 'search__results' }, results)
      ])
    )
  }
}

preact.render(h(Search), document.querySelector('#search'))