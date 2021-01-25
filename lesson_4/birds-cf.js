function Bird () {}
Bird.prototype.canFlyM = function() {
    console.log(`a ${this.type} ${this.canFly ? 'can' : 'cannot'} fly.`);
}
Bird.prototype.canSwimM = function() {
    console.log(`a ${this.type} ${this.canSwim ? 'can' : 'cannot'} swim.`);
}

let flyMix = {  // any non-falsy val
  canFly: true
}
let swimMix = {
  canSwim() {}
}

function FlyingBird(type) {
  this.type = type;
}
FlyingBird.prototype = Object.create(Bird.prototype);
/* sets FlyingBird.prototype to an {} that inherits
  from Bird.prototype & uses its .constructor */
FlyingBird.prototype.constructor = FlyingBird;

Object.assign(FlyingBird.prototype, flyMix);
// merges FB.prototype & flyMix, this.canFly --> true ON PROTOTYPE

function SwimmingBird(type) {
  this.type = type;
}
SwimmingBird.prototype = Object.create(Bird.prototype);
SwimmingBird.prototype.constructor = SwimmingBird;
Object.assign(SwimmingBird.prototype, swimMix);

function SpecialBird(type) {
  this.type = type;
}
SpecialBird.prototype = Object.create(Bird.prototype);
SpecialBird.prototype.constructor = SpecialBird;
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
