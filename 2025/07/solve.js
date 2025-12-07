const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;

const map = [];

for (const lines of input.split('\n')) {
  map.push(lines.split(''));
}

let sy=0;
let sx=map[0].indexOf('S');

let splits=0;

function tachyonBeam(map, y, x) {
  map[y][x]='|'; // mark beam path
  y=y+1; // tachbyon beam always travels downwards
  if (y>=map.length) return 0; // out of bounds
  if (map[y][x]==='^') { // divide
    // left beam
    var left=0;
    if (x>0 && map[y][x-1]!=='|') { 

      left=tachyonBeam(map, y, x-1);
    }

    // right beam
    var right=0;
    if (x<map[0].length-1 && map[y][x+1]!=='|') right=tachyonBeam(map, y, x+1);

    splits=splits+1;
    console.log("at split",splits, y,x, "we return",1+left+right);

    return 1+left+right;
  } else {
    return tachyonBeam(map, y, x);
  }

}
console.log(tachyonBeam(map, sy, sx));
for (const line of map) {
  console.log(line.join(''));
}
p1 = splits;



console.log("Part 1:", p1);
console.log("Part 2:", p2);
