// Q4

console.log(`iterative solution`.toUpperCase());
function reassignProperty(obj, k, v) {
  while (obj) {
    if (obj.hasOwnProperty(k)) {
      obj[k] = v;
      break;
    }

    obj = Object.getPrototypeOf(obj);
  }
}

let fooA = { foo: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

reassignProperty(fooC, 'foo', 2);
console.log(fooA, fooB.foo, fooC.foo);

fooB.bar = 33;
reassignProperty(fooC, 'bar', 'larry');
console.log(fooA.bar, fooB, fooC.bar);

//  * * * * *
console.log('recursive solution'.toUpperCase());
function reassignPropRecursive(obj, k, v) {
  if (obj.hasOwnProperty(k)) {
    obj[k] = v;
    return;
  } else if (Object.getPrototypeOf(obj)) {
    obj = Object.getPrototypeOf(obj);
  }

  reassignPropRecursive(obj, k, v);
}

let fezA = { fez: 1 };
let fezB = Object.create(fezA);
let fezC = Object.create(fezB);

reassignPropRecursive(fezC, 'fez', 2);
console.log(fezA, fezB.fez, fezC.fez);

fezB.bar = 33;
reassignPropRecursive(fezC, 'bar', 'larry');
console.log(fezA.bar, fezB, fezC.bar);
