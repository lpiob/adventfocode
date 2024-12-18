const input = require('fs').readFileSync(0).toString().trim(); 
let sum_step1=0;
let sum_step2=0;
for (const line of input.split("\n")) {
  const n=line.split(/\s+/).map(Number);
  const max=Math.max(...n)
  const min=Math.min(...n)
  const diff=max-min;
  sum_step1+=diff;

  console.log(n);
  for (const n1 of n)
    for (const n2 of n)
      if ((n1!==n2) && (n1%n2==0))
        sum_step2+=n1/n2;

};
console.log(sum_step1, sum_step2);
