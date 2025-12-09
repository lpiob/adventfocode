const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;

let coords=[];

for (const line of input.split('\n')) {
  coords.push(line.split(',').map(Number));
};

for (let i=0; i<coords.length; i++) {
  let [x1, y1] = coords[i];
  let area = 0;
  for (let j=0; j<coords.length; j++) {
    if (i === j) continue;
    let [x2, y2] = coords[j];
    area = (Math.abs(x2 - x1)+1) * (Math.abs(y2 - y1)+1);
    //console.log(`Area between (${x1},${y1}) and (${x2},${y2}): ${area}`);
    p1 = Math.max(p1, area);
  }
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
