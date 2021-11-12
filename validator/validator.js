const validator = require('validator')

const illegal = '<>{}'
const now = new Date().toISOString().slice(0, 10)

class Validator {
  fail (message) {
    // console.log('Validation error: ' + message)
    throw Error(message)
  };

  type (key, data, expected, url = false) {
    let actual = typeof data
    if (Array.isArray(data)) {
      actual = 'array'
    }
    if (actual !== expected) {
      this.fail(`'${key}': Data type error! Expected '${expected}', found '${actual}'`)
    }
    if (actual === 'string') {
      for (const c of illegal) {
        if (data.includes(c)) {
          this.fail(`'${key}': Illegal character (${c})! - [${data}]`)
        }
      }
      if (!url && validator.isURL(data)) {
        this.fail(`'${key}': URL not allowed! - [${data}]`)
      }
    }
  }

  check (key, value, desc, isUpdate) {
    const type = desc.type
    if (type === 'text') {
      this.type(key, value, 'string')
      const length = this.value(desc.length, 0)
      if (length > 0 && value.length > length) {
        this.fail(`'${key}': Too long! - [MAX = ${length}]`)
      }
      return
    } else if (type === 'date') {
      this.type(key, value, 'string')
      const past = this.value(desc.past, true)
      this.validateDate(value, key, past)
      return
    } else if (type === 'email') {
      this.type(key, value, 'string', true)
      this.validateEmail(value, key)
      return
    } else if (type === 'id') {
      this.type(key, value, 'string')
      this.validateID(value, key)
      return
    } else if (type === 'code') {
      this.type(key, value, 'string')
      this.validatePostCode(value, key)
      return
    } else if (type === 'int') {
      this.type(key, value, 'number')
      if (value % 1 !== 0) {
        this.fail(`'${key}': Expected int! - [${value}]`)
      }
      const negative = this.value(desc.negative, false)
      if (!negative && value < 0) {
        this.fail(`'${key}': Negative value not allowed! - [${value}]`)
      }
      return
    } else if (type === 'float') {
      this.type(key, value, 'number')
      const negative = this.value(desc.negative, false)
      if (!negative && value < 0) {
        this.fail(`'${key}': Negative value not allowed! - [${value}]`)
      }
      return
    } else if (type === 'bool') {
      this.type(key, value, 'boolean')
      return
    } else if (type === 'object') {
      this.type(key, value, 'object')
      this.validate(value, desc.structure, isUpdate)
      return
    }
    this.fail(`'${type}': Unknown data type!`)
  };

  value (item, value) {
    if (typeof item !== 'undefined') {
      return item
    }
    return value
  };

  //
  // Validate data against given template.
  // Throws an error if validation fails.
  //
  validate (data, template, isUpdate = false) {
    if (!data) return

    if (typeof data !== 'object' || Array.isArray(data)) {
      this.fail(`Not an object! - [${data}]`)
    }

    if (!template) {
      this.fail('A template must be specified!')
    }

    for (const [k, v] of Object.entries(template)) {
      const p = data[k]
      const mandatory = this.value(v.mandatory, true)
      const array = this.value(v.array, false)
      if (!p) {
        if (mandatory && !isUpdate) {
          this.fail(`'${k}': Missing property!`)
        }
      } else {
        if (array) {
          if (!Array.isArray(p)) {
            this.fail(`'${k}': Data type error! Expected 'array', found '${typeof p}'`)
          }
          for (const e of p) {
            this.check(k, e, v, isUpdate)
          }
        } else {
          this.check(k, p, v, isUpdate)
        }
      }
    }
  };

  message (key, message, data) {
    if (key) {
      return `'${key}': ${message} - [${data}]`
    }
    return `${message} - [${data}]`
  }

  validateID (id, key = null) {
    if (!validator.isUUID(id)) {
      this.fail(this.message(key, 'Invalid unique ID!', id))
    }
  }

  validateEmail (email, key = null) {
    if (!validator.isEmail(email)) {
      this.fail(this.message(key, 'Invalid e-mail address!', email))
    }
  }

  validateDate (date, key = null, past = true) {
    if (!validator.isDate(date)) {
      this.fail(this.message(key, 'Invalid date!', date))
    }
    if (!past && validator.isBefore(date, now)) {
      this.fail(this.message(key, 'Date cannot be in the past!', date))
    }
  }

  validatePostCode (code, key = null) {
    if (!validator.isPostalCode(code, 'GB')) {
      this.fail(this.message(key, 'Invalid post code!', code))
    }
  }
}

module.exports = new Validator()
