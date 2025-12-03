const input = require('fs').readFileSync(0).toString().trim(); 
const banks=input.split("\n");

let p1=0;
let p2=0;

function findFirstLargestDigitInSet(numbers) {
  const val = [...numbers].sort((a,b)=>b-a)[0];
  const idx = numbers.indexOf(val);
  
  return {val, idx}
}

function findMaxJolt(numbers, len) {
  console.log('findMaxJolt called with:', numbers, len);
  // start by finding the largest digit that will start the jolt
  console.log('finding largest digit in set:', numbers.slice(0, numbers.length - len + 1));
  const {val, idx} = findFirstLargestDigitInSet(numbers.slice(0, numbers.length - len + 1));
  // continue by finding the next largest digit in the remaining set
  if (len > 1) {
    console.log('finding next jolt in remaining set:', numbers.slice(idx + 1));
    const next_jolt = findMaxJolt(numbers.slice(idx + 1), len - 1);
    console.log('next jolt found:', next_jolt);
    return Number(String(val) + String(next_jolt));
  }
  return val;
}

for (const bank of banks) {
  let numbers = bank.split('').map(Number);
  console.log('bank:', bank, numbers);
  const smallJolt=findMaxJolt(numbers, 2);
  const largeJolt=findMaxJolt(numbers, 12);
  //
  //
  console.log('largest digit in set:', findFirstLargestDigitInSet(numbers));
  console.log('max jolt(2) found:', smallJolt);
  console.log('max jolt(12) found:', largeJolt);


  p1+=smallJolt;
  p2+=largeJolt;
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
