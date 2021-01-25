class Bird {
  canFlyM() {
    console.log(`a ${this.type} ${this.canFly ? 'can' : 'cannot'} fly.`);
  }
  canSwimM() {
    console.log(`a ${this.type} ${this.canSwim ? 'can' : 'cannot'} swim.`);
  }
}

let flyMix = {  // any non-falsy val
  canFly: true
}
let swimMix = {
  canSwim() {}
}

class FlyingBird extends Bird {
  constructor(type) {
    super();
    this.type = type;
  }
}
Object.assign(FlyingBird.prototype, flyMix);

class SwimmingBird extends Bird {
  constructor(type) {
    super();
    this.type = type;
  }
}
Object.assign(SwimmingBird.prototype, swimMix);

class SpecialBird extends Bird {
  constructor(type) {
    super();
    this.type = type;
  }
}
Object.assign(SpecialBird.prototype, flyMix, swimMix);

let polly = new FlyingBird('parrot');
let pengu = new SwimmingBird('penguin');
let donald = new SpecialBird('duck');

console.log('polly:', polly.constructor);
polly.canFlyM();
polly.canSwimM();
console.log(`polly's prototype:`, Object.getPrototypeOf(polly));

console.log('pengu:', pengu.constructor);
pengu.canFlyM();
pengu.canSwimM();
console.log('donald:', donald.constructor);
donald.canFlyM();
donald.canSwimM();
