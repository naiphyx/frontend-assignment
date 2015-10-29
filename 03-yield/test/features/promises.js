import {
  es5,
  es6
} from '../../src/features/promises'

export default function() {
  it('should wait for result in ES5', (done) => {
    es5(function(err, val) {
      if (err) {
        done(err)
      }
      val.should.eql(10)
      done()
    })
  })

  it('should show Promise behavior in ES6', () => {
    const promise = new Promise((resolve, reject) => {
      const val = 10
      resolve(val)
    })
    promise
      .then(val => {
        console.log(val)
      })
      .catch(err => {
        console.error(err)
      })
  })
}
