const input = require('fs').readFileSync(0).toString().trim(); 

function calculateFloor(input) {
  ups=input.match(/\(/g);
  downs=input.match(/\)/g);
  let floor = 0;
  if (ups) floor+=ups.length;
  if (downs) floor-=downs.length;
  return floor;
}

console.log(calculateFloor(input));

// part2
for (let i=1; i<input.length; i++) {
 const sl=input.slice(0,i);
 const floor=calculateFloor(sl);
 if (floor==-1) {
   console.log(i);
   process.exit(0);
 };
};
