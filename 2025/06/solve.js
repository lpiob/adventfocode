const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;
let registers=[];
for(let line of input.split('\n')){
  line=line.replace(/\s+/g,' ').trim();
  console.log("Line:", line);
  let parts=line.split(' ');
  console.log("Parts:", parts);
  if (parts[0]==='+' || parts[0]==='*') {
    const transposed = registers[0].map((_, i) => registers.map(row => row[i]));
    console.log("transposed:", transposed);
    let col=0;
    for (const op of parts) {
      let vals = transposed[col];
      if (op === '+') {
        const sum = vals.reduce((a, b) => a + b, 0);
        p1 += sum;
      } else if (op === '*') {
        const prod = vals.reduce((a, b) => a * b, 1);
        p1 += prod;
      }
      col++;
    }

  } else {
    registers.push(parts.map(Number));
  }
}
console.log(registers);

console.log("Part 1:", p1);
