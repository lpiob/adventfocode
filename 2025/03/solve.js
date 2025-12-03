const input = require('fs').readFileSync(0).toString().trim(); 
const banks=input.split("\n");

let p1=0;
let p2=0;

for (const bank of banks) {
  let numbers = bank.split('').map(Number);
  console.log('bank:', bank, numbers);
  let pairs = [];
  for (let i=0; i<numbers.length-1; i++) {
    const current_digit=numbers[i];
    const next_max_digit=numbers.slice(i+1).sort((a,b)=>b-a)[0]||-1;
    pairs.push(current_digit*10+next_max_digit);
  }
  pairs.sort((a,b)=>b-a);
  console.log('greatest pair:', pairs[0]);
  p1+=pairs[0];
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
