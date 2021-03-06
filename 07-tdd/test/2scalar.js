var should = require('should')
<<<<<<< HEAD:07-tdd/test/scalar2.js
var scalar = require('../src/scalar2.js')
=======
var scalar = require('../src/2scalar.js')
>>>>>>> ae86a47cf249ca4b163cd6cb4d9de0895b8c77d4:07-tdd/test/2scalar.js

describe('scalar', function() {

  it('should take number as input', function() {
    should(scalar(10)).be.a.Number()
  })

  it('should take string as input', function() {
    should(scalar('hello')).be.a.String()
  })

  it('should take boolean as input', function() {
    should(scalar(true)).be.a.Boolean()
  })

  it('should not take null as input', function() {
    (function() {
      scalar(null)
    }).should.throw()
  })

  it('should not take an object as input', function() {
    (function() {
      scalar({})
    }).should.throw()
  })

})
