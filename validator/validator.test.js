// This uses the Jest  test framework.

'use strict'

const validator = require('./validator')

function validate (data, error, template = null, isUpdate = false) {
  try {
    validator.validate(data, template, isUpdate)
    expect('').toBe(error)
  } catch (e) {
    expect(e.message).toBe(error)
  }
}

describe('Valiidator', () => {
  const template = {
    id: {
      type: 'id',
      mandatory: false
    },
    first: {
      type: 'text',
      length: 25
    },
    last: {
      type: 'text',
      length: 25
    },
    email: {
      type: 'email'
    },
    birthDate: {
      type: 'date'
    },
    notes: {
      type: 'text',
      length: 25,
      mandatory: false,
      array: true
    },
    age: {
      type: 'int',
      mandatory: false
    },
    height: {
      type: 'float',
      mandatory: false
    },
    married: {
      type: 'bool',
      mandatory: false
    },
    address: {
      type: 'object',
      structure: {
        line1: {
          type: 'text',
          length: 25
        },
        line2: {
          type: 'text',
          mandatory: false,
          length: 25
        },
        postcode: {
          type: 'code'
        },
        city: {
          type: 'text',
          length: 25
        },
        county: {
          type: 'text',
          mandatory: false,
          length: 25
        },
        country: {
          type: 'text',
          length: 25
        }
      }
    }
  }

  it('No template.', async () => {
    const data = {
      id: 'AA761232-BD42-11CF-AACD-00AA0057B243',
      first: 'Patrick',
      last: 'Lucas',
      email: 'patrick.lucas@opencastsoftware.com',
      age: 50,
      birthDate: '1970-11-12',
      notes: ['a', 'b'],
      postcode: 'SW11 3LX'
    }
    validate(data, 'A template must be specified!')
  })

  it('Bad ID.', async () => {
    const id = 'AA'
    try {
      validator.validateID(id)
    } catch (e) {
      expect(e.message).toBe('Invalid unique ID! - [AA]')
    }
  })

  it('Bad date.', async () => {
    const date = 'AA'
    try {
      validator.validateDate(date)
    } catch (e) {
      expect(e.message).toBe('Invalid date! - [AA]')
    }
  })

  it('Bad e-mail.', async () => {
    const email = 'AA'
    try {
      validator.validateEmail(email)
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail address! - [AA]')
    }
  })

  it('Bad post code..', async () => {
    const code = 'AA'
    try {
      validator.validatePostCode(code)
    } catch (e) {
      expect(e.message).toBe('Invalid post code! - [AA]')
    }
  })

  it('All Ok.', async () => {
    const data = {
      id: 'AA761232-BD42-11CF-AACD-00AA0057B243',
      first: 'Patrick',
      last: 'Lucas',
      email: 'patrick.lucas@opencastsoftware.com',
      birthDate: '1970-11-12',
      notes: ['a', 'b'],
      age: 50,
      height: 1.81,
      married: true,
      address: {
        line1: 'Chase House',
        line2: '4 Mandarin Rd',
        postcode: 'DH4 5RA',
        city: 'Sunderland',
        county: 'Houghton le Spring',
        country: 'United Kingdom'
      }
    }
    validate(data, '', template)
  })

  it('Update Only.', async () => {
    const data = {
      age: 51,
      height: 1.82,
      address: {
        postcode: 'DH4 5RB'
      }
    }
    validate(data, '', template, true)
  })

  it('Missing data.', async () => {
    const data = {
      first: 'Patrick',
      last: 'Lucas',
      email: 'patrick.lucas@opencastsoftware.com',
      birthDate: '1970-11-12',
      notes: ['a', 'b'],
      address: {
        line1: 'Chase House',
        postcode: 'DH4 5RA',
        county: 'Houghton le Spring',
        country: 'United Kingdom'
      }
    }
    validate(data, '\'city\': Missing property!', template)
  })

  it('Too long.', async () => {
    const data = {
      first: 'Patrick',
      last: 'Lucas',
      email: 'patrick.lucas@opencastsoftware.com',
      birthDate: '1970-11-12',
      notes: ['a', 'b'],
      address: {
        line1: 'Chase House',
        line2: '4 Mandarin Chineese Languge Road',
        postcode: 'DH4 5RA',
        city: 'Sunderland',
        county: 'Houghton le Spring',
        country: 'United Kingdom'
      }
    }
    validate(data, '\'line2\': Too long! - [MAX = 25]', template)
  })

  it('Data type error.', async () => {
    const template = {
      address: {
        type: 'text',
        length: 25
      }
    }

    const data = {
      address: ['Sunderland']
    }
    validate(data, '\'address\': Data type error! Expected \'string\', found \'array\'', template)
  })

  it('Bad ID.', async () => {
    const template = {
      id: {
        type: 'id'
      }
    }

    const data = {
      id: 'AA'
    }
    validate(data, '\'id\': Invalid unique ID! - [AA]', template)
  })

  it('Bad date.', async () => {
    const template = {
      date: {
        type: 'date'
      }
    }

    const data = {
      date: 'AA'
    }
    validate(data, '\'date\': Invalid date! - [AA]', template)
  })

  it('Past date.', async () => {
    const template = {
      date: {
        type: 'date',
        past: false
      }
    }

    const data = {
      date: '2020-01-01'
    }
    validate(data, '\'date\': Date cannot be in the past! - [2020-01-01]', template)
  })

  it('Bad e-mail.', async () => {
    const template = {
      email: {
        type: 'email'
      }
    }

    const data = {
      email: 'AA'
    }
    validate(data, '\'email\': Invalid e-mail address! - [AA]', template)
  })

  it('Bad post code.', async () => {
    const template = {
      postcode: {
        type: 'code'
      }
    }

    const data = {
      postcode: 'AA'
    }
    validate(data, '\'postcode\': Invalid post code! - [AA]', template)
  })

  it('URLs.', async () => {
    const template = {
      address: {
        type: 'text',
        length: 25
      }
    }

    const data = {
      address: 'http://www.bbc.co.uk'
    }
    validate(data, '\'address\': URL not allowed! - [http://www.bbc.co.uk]', template)
  })

  it('Illegal characters.', async () => {
    const template = {
      address: {
        type: 'text',
        length: 25
      }
    }

    const data = {
      address: 'A<b>C'
    }
    validate(data, '\'address\': Illegal character (<)! - [A<b>C]', template)
  })

  it('Array expected.', async () => {
    const template = {
      notes: {
        type: 'text',
        length: 25,
        array: true
      }
    }

    const data = {
      notes: 'ANC'
    }
    validate(data, '\'notes\': Data type error! Expected \'array\', found \'string\'', template)
  })

  it('Integer.', async () => {
    const template = {
      age: {
        type: 'int'
      }
    }

    const data = {
      age: 23.1
    }
    validate(data, '\'age\': Expected int! - [23.1]', template)
  })

  it('Negative integer.', async () => {
    const template = {
      age: {
        type: 'int'
      }
    }

    const data = {
      age: -23
    }
    validate(data, '\'age\': Negative value not allowed! - [-23]', template)
  })

  it('Negative floating point.', async () => {
    const template = {
      height: {
        type: 'float'
      }
    }

    const data = {
      height: -1.83
    }
    validate(data, '\'height\': Negative value not allowed! - [-1.83]', template)
  })

  it('Unknown data type..', async () => {
    const template = {
      notes: {
        type: 'xxx',
        length: 25,
        array: true
      }
    }

    const data = {
      notes: ['ABC']
    }
    validate(data, '\'xxx\': Unknown data type!', template)
  })

  it('Not object.', async () => {
    validate('ABC', 'Not an object! - [ABC]', template)
  })

  it('Empty.', async () => {
    try {
      validator.validate(null, template)
      expect(true).toBe(true)
    } catch (e) {
      expect(true).toBe(false)
    }
  })
})
