const input = require('fs').readFileSync(0).toString().trim(); 
const banks=input.split("\n");

let p1=0;
let p2=0;

function findNextJolt(numbers, len) {
  // console.log("findNextJolt called with:", numbers, len);
  let pairs=[];
  for (let i=0; i<numbers.length-len; i++) {
    const current_digit=numbers[i];
    if (len==0) { 
      return current_digit;
    }
    for (let j=i+1; j<numbers.length-len+1; j++) {
        // console.log('current len:', len, 'current digit:', current_digit, 'looking at:', numbers[j]);
        // console.log('recursive call with:', [...numbers].splice(j), len-1);
        const next_number=findNextJolt([...numbers].splice(j), len-1);
        pairs.push(Number(String(current_digit)+String(next_number)));
    }
  };
  // console.log('all pairs found:', pairs);
  pairs.sort((a,b)=>b-a);
  // console.log('returning pairs:', pairs[0]);
  return pairs[0];
};

for (const bank of banks) {
  let numbers = bank.split('').map(Number);
  console.log('bank:', bank, numbers);
  const smallJolt=findNextJolt(numbers, 1);
  const largeJolt=findNextJolt(numbers, 11);
  console.log('small jolt:', smallJolt);
  console.log('large jolt:', largeJolt);

  p1+=smallJolt;
  p2+=largeJolt;
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
