module.exports = function(val) {
  "use strict"
  class Dog {
  constructor(name) {
    this.name = name
  }

  makeSound() {
    return "Woof"
  }
}

var dog = new Dog(val)
return dog;
}
