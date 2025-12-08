const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;

let jbs=[];
let i=0;
for (const line of input.split('\n')) {
  const pos=line.split(",").map(Number);
  jbs.push({ pos: pos, idx: i++ });
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

console.log("All pairs sorted by distance");

let dfu_parent = Array(jbs.length).fill(0).map((_, idx) => idx);
let dfu_size = Array(jbs.length).fill(1);

//console.log('parents', dfu_parent);
//console.log('sizes', dfu_size);

function dfu_find(x) {
  if (dfu_parent[x] !== x)
    dfu_parent[x] = dfu_find(dfu_parent[x]);

  return dfu_parent[x];
}

for (let i=0; i<Infinity; i++) {
  if (i==1000) {
    // top 3 sizes
    const rootSizes = dfu_size.filter((size, idx) => dfu_parent[idx] === idx);
    console.log('Top 3 sizes:', rootSizes.sort((a,b) => b - a).slice(0,3));

    // multiply the above
    p1 = rootSizes.sort((a,b) => b - a).slice(0,3).reduce((a,b) => a*b, 1);
    console.log("Part 1:", p1);
  };
  const pair=pairs.shift();
  if (!pair) break;
//  console.log(`Processing pair with distance ${pair.dist.toFixed(2)} between JB1: ${pair.jb1.pos} and JB2: ${pair.jb2.pos}`);
  //
  const root1 = dfu_find(pair.jb1.idx);
  const root2 = dfu_find(pair.jb2.idx);
  //console.log(i, 'connecting', pair.jb1, pair.jb2);
  //console.log('parents', dfu_parent);



  if (root1 === root2) continue;

  dfu_parent[root2] = root1;
  dfu_size[root1] += dfu_size[root2];  

  if (dfu_size[root1] === jbs.length) {    
    console.log('Finished at iteration', i+1);
    console.log('pairs', pair.jb1, pair.jb2);
    p2=pair.jb1.pos[0]*pair.jb2.pos[0];
    break;
  };


};

console.log("Part 2:", p2);
