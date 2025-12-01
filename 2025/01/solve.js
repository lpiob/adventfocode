const input = require('fs').readFileSync(0).toString().trim(); 

const lines=input.split("\n");

let pos = 50;
let reached_zero = 0;

let p1=0;
let p2=0;

console.log('The dial starts by pointing at', pos);

for (const line of lines) {
  let [direction, distance]=line.match(/^([A-Z])(\d+)$/).slice(1);
  if (direction==='L') distance=-distance;
  let new_pos = pos+Number(distance);

  if (new_pos%100 == 0) p1++;
  p2+=Math.abs( Math.floor(new_pos/100) - Math.floor(pos/100));
  if (new_pos < pos) {
    p2+=( new_pos%100 == 0 ) - ( pos%100 == 0 );
  };
  console.log(pos, direction, distance, new_pos);
  pos=new_pos%100;
};
console.log('p1', p1);
console.log('p2', p2);
