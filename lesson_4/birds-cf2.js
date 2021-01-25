function Bird (type) {
  this.type = type;
}
Bird.prototype.canFlyM = function() {
    console.log(`a ${this.type} ${this.canFly ? 'can' : 'cannot'} fly.`);
}
Bird.prototype.canSwimM = function() {
    console.log(`a ${this.type} ${this.canSwim ? 'can' : 'cannot'} swim.`);
}

let flyMix = {
  canFly: true
}
let swimMix = {
  canSwim: true
}

let polly = new Bird('parrot');
Object.assign(polly, flyMix); // polly.canFly --> true ON POLLY

let pengu = new Bird('penguin');
Object.assign(pengu, swimMix);

let donald = new Bird('duck');
Object.assign(donald, flyMix, swimMix);

console.log('polly:', polly.constructor);
polly.canFlyM();
polly.canSwimM();
console.log('polly:', polly);

console.log('pengu:', pengu.constructor);
pengu.canFlyM();
pengu.canSwimM();
console.log('donald:', donald.constructor);
donald.canFlyM();
donald.canSwimM();
