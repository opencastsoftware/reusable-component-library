'use strict'

class Comparator {
  compare (oldObj, newObj) {
    if (typeof oldObj !== 'object' || typeof newObj !== 'object') {
      throw Error('Must compare objects!')
    }
    if (Array.isArray(oldObj) || Array.isArray(newObj)) {
      throw Error('Cannot compare arrays!')
    }
    const diffObj = {}
    for (const [key, newVal] of Object.entries(newObj)) {
      const oldVal = oldObj[key]
      if (typeof newVal === 'object') {
        const subObj = this.compare(oldVal, newVal)
        if (Object.entries(subObj).length !== 0) {
          diffObj[key] = subObj
        }
      } else if (newVal !== oldVal) {
        diffObj[key] = newVal
      }
    }
    return diffObj
  }
}

module.exports = new Comparator()
