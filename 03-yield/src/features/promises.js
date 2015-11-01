export function es5(cb) {
  setTimeout(function() {
    cb(null, 10)
  }, 1)
}

export function es6() {
	 const promise = new Promise((resolve, reject) => {
        setTimeout(function() {
          resolve(val)
        }, 1)
      })
  return promise
}
