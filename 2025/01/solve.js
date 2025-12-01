const input = require('fs').readFileSync(0).toString().trim(); 

const lines=input.split("\n");

let pos = 50;
let reached_zero = 0;

console.log('The dial starts by pointing at', pos);

for (const line of lines) {
  let [direction, distance]=line.match(/^([A-Z])(\d+)$/).slice(1);
  if (direction==='L') distance=-distance;
  const original_pos=pos;
  console.log('Original position:', original_pos, 'original reached_zero:', reached_zero);
  pos+=Number(distance);
  //if (pos<0) pos+=100;
  //if (pos>=100) pos-=100;
  let passed_zero = 0;
  while (pos>=100) { 
    pos-=100; 
    if (pos!==0) passed_zero++;
  }
  while (pos<0) { 
    pos+=100; 
    if (original_pos!=0) passed_zero++;
  }
  console.log('The dial is rotated', direction, distance, 'to point at', pos, pos===0?' (reached zero!)':'', (passed_zero>0?`during this rotation, it points at 0x${passed_zero} timess`:''));
  reached_zero+=passed_zero;
  if (pos===0) reached_zero++;
  console.log('Current reached_zero:', reached_zero);
};

console.log('password', reached_zero);
