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

  normalizeEntity(entity, entityTypeNames) {
    const normalizers = {
      'phone': data => data && data.replace(/(\(*-*\)*\s*)/g, ''),
    }
    const copy = entity

    Object.keys(entity).forEach(key => {
      if (normalizers[key])
        copy[key] = normalizers[key](copy[key])
    })

    copy.__entityType = entityTypeNames
    return copy
  }

  normalizeEntities(entityTypes) {
    const entities = []

    entityTypes.forEach(entityType => {
      entityType.data.forEach(entity => {
        entities.push(this.normalizeEntity(entity, entityType.name))
      })
    })

    return entities
  }

  componentDidMount() {
    this
    .load()
    .then(entityTypes => {
      this.search.addIndex('name')
      this.search.addIndex(['location', 'name'])
      this.search.addIndex('phone')
      this.search.addIndex('__entityType')
      this.search.addDocuments(this.normalizeEntities(entityTypes))
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
      '/data/remax_property.json',
      '/data/nosara_com_hotels.json',
      '/data/nosara_com_restaurants.json'
    ].map(async data => {
      const response = await fetch(data)
      return await response.json()
    }))
  }

  query(n) {
    return this.search.search(this.state.query).slice(0, n)
  }

  render() {
    // 'You could try looking for people, properties or charities.'
    // 'What are you looking for?'
    const $search = document.querySelector('#search')
    const placeholderText = $search.getAttribute('data-placeholder')
    const suggestionText = $search.getAttribute('data-suggestion')

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
          h('input', { value: this.state.query, className: 'field__input', id: 'search', type: 'text', name: 'search', placeholder: placeholderText, onInput: this.onChange })
        ]),
        !this.state.query ? h('div', { className: 'search__suggestions' }, suggestionText) : null,
        h('div', { className: 'search__results' }, results)
      ])
    )
  }
}

preact.render(h(Search), document.querySelector('#search'))