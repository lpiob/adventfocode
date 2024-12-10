const input = require('fs').readFileSync(0).toString().trim(); 

let topomap=[]; // 2d map

let x=0;
let y=0;

let trailheads=[];
let trailends=[];
for (let row of input.split('\n')) {
  topomap[y]=[];
  for (let cell of row) {
    topomap[y][x]=cell;
    if (cell==0) trailheads.push([y,x]);
    if (cell==9) trailends.push([y,x]);
    x++;
  }
  y++; x=0;
}

const topomap_height=topomap.length;
const topomap_width=topomap[0].length;
console.log(topomap);
console.log(trailheads.length, trailends.length);

let sum_score=0;
for (trail of trailheads) {
  let score=traverse(-1, trail[0], trail[1])
  console.log("Trailhead",trail,"has score",score.length);
  sum_score+=score.length;
}

console.log("score sum", sum_score);


function traverse(lastcell, y,x) {
  if (y<0 || x<0 || y>=topomap_height || x>=topomap_width) return null;

  const cell=Number(topomap[y][x])
  if (lastcell>=cell || lastcell+1!=cell) return null;

  if (cell==9) return ""+y+"x"+x;

  //console.log("we're",cell,"at",y,x)
 
  let continuations=[];
  const up=traverse(cell, y-1, x);
  if (up) continuations.push(up);
  const down=traverse(cell, y+1, x);
  if (down) continuations.push(down);
  const left=traverse(cell, y, x-1);
  if (left) continuations.push(left);
  const right=traverse(cell, y, x+1);
  if (right) continuations.push(right);
  continuations=[...new Set(continuations.flat())];
  
  return continuations;
}

