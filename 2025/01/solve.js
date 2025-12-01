const input = require('fs').readFileSync(0).toString().trim(); 

const lines=input.split("\n");

let pos = 50;
let reached_zero = 0;

console.log('The dial starts by pointing at', pos);

for (const line of lines) {
  let [direction, distance]=line.match(/^([A-Z])(\d+)$/).slice(1);
  if (direction==='L') distance=-distance;
  pos+=Number(distance);
  //if (pos<0) pos+=100;
  //if (pos>=100) pos-=100;
  while (pos>=100) pos-=100;
  while (pos<0) pos+=100;
  console.log('The dial is rotated', direction, distance, 'to point at', pos, pos===0?' (reached zero!)':'');
  if (pos===0) reached_zero+=1;
};

console.log('password', reached_zero);
