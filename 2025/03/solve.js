const input = require('fs').readFileSync(0).toString().trim(); 
const banks=input.split("\n");

let p1=0;
let p2=0;

for (const bank of banks) {
  let numbers = bank.split('').map(Number);
  console.log('bank:', bank, numbers);
  const indices = [...numbers]
    .map((val, idx) => ({val, idx}))
    .sort((a, b) => b.val - a.val)
    .slice(0, 2)
    .map(item => item.idx)
    .sort((a, b) => a - b);
  const largest_pair = Number(indices.map(i => numbers[i]).join(''));
  console.log('bank:', bank, largest_pair, indices);
  p1 += largest_pair;
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
