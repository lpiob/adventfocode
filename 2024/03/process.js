const input = require('fs').readFileSync(0).toString().trim().replace(/\n/gm,'');

let new_input=input.replace(/don't\(\).*?do\(\)/mg, '');
console.log(new_input);

let sum=0;
// reading input
const muls = new_input.match(/mul\(\d+,\d+\)/g)
for (mul of muls) {
  const [_, a,b]=mul.match(/(\d+),(\d+)/)
  sum+=(a*b)
}
console.log(sum);

