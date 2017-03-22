// got from http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain

function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // The constructor property was set wrong, let's fix it
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
}

// Let's try this
function Animal(name) {
  this.name = name;
}

Animal.prototype = {
  sayMyName: function() {
    console.log(this.getWordsToSay() + " " + this.name);
  },
  getWordsToSay: function() {
    // Abstract
  }
}

function Dog(name) {
  // Call the parent's constructor
  Animal.call(this, name);
}

Dog.prototype = {
    getWordsToSay: function(){
      return "Ruff Ruff";
    }
}    

// Setup the prototype chain the right way
extend(Animal, Dog);

// Here is where the Dog (and Animal) constructors are called
var dog = new Dog("Lassie");
dog.sayMyName(); // Outputs Ruff Ruff Lassie
console.log(dog instanceof Animal); // true
console.log(dog.constructor); // Dog
