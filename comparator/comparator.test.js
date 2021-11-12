// This uses the Jest  test framework.

'use strict'

const comparator = require('./comparator')

const oldObj = {
  last: 'Cantona',
  first: 'E',
  address: {
    city: 'Paris',
    country: 'Frace'
  },
  extra: {
    occupation: 'Footballer'
  }
}

const newObj = {
  last: 'Cantona',
  first: 'Eric',
  address: {
    city: 'Paris',
    country: 'France'
  },
  extra: {
    occupation: 'Footballer'
  },
  notes: 'The Best!'
}

const diff = {
  first: 'Eric',
  address: { country: 'France' },
  notes: 'The Best!'
}

describe('Comparator', () => {
  it('Changed properties only.', async () => {
    const result = comparator.compare(oldObj, newObj)
    expect(result).toEqual(diff)
  })

  it('Errors are handled.', async () => {
    try {
      comparator.compare(1, [])
      expect(true).toBe(false)
    } catch (e) {
      expect(true).toBe(true)
      try {
        comparator.compare([], [])
        expect(true).toBe(false)
      } catch (e) {
        expect(true).toBe(true)
      }
    }
  })
})
