module.exports.getMissingFields = (item, fieldNames) => {
  const missingFields = []

  fieldNames.forEach(fieldName => {
    if (typeof item[fieldName] === 'undefined') {
      missingFields.push(fieldName)
    }
  })

  return missingFields
}

module.exports.validate = (item, entity) => {
  if (!item) {
    return ['Null item']
  }

  return []
  //return module.exports.getMissingFields(item, entity.fields)
}