const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;

let jbs=[];
for (const line of input.split('\n')) {
  const pos=line.split(",").map(Number);
  jbs.push({ pos: pos, connections: [] });
}

function distance(jb1, jb2) {
  return Math.sqrt(
    (jb1.pos[0]-jb2.pos[0])**2 +
    (jb1.pos[1]-jb2.pos[1])**2 +
    (jb1.pos[2]-jb2.pos[2])**2
  );
}

let pairs = [];
for (let i=0; i<jbs.length; i++) {
  for (let j=i+1; j<jbs.length; j++) {
    const dist = distance(jbs[i], jbs[j]);
    pairs.push({ jb1: jbs[i], jb2: jbs[j], dist: dist });
  }
}
pairs.sort((a,b) => a.dist - b.dist);

console.log("All pairs sorted by distance:");
for (const pair of pairs) {
  console.log(`Distance: ${pair.dist.toFixed(2)}, JB1: ${pair.jb1.pos}, JB2: ${pair.jb2.pos}`);
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
