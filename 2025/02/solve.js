const input = require('fs').readFileSync(0).toString().trim(); 
const ranges=input.split(",");

let p1=0;

for (const range of ranges) {
  console.log('range', range);
  let [start, end]=range.split("-").map(Number);
  for (let i=start; i<=end; i++) {
    if (String(i).match(/^(\d+)\1$/)) {
      console.log(i);
      p1=p1+i;
    }
  }
}

console.log("Part 1:", p1);

