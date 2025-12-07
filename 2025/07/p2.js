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

let paths=new Map();

function tachyonBeam(map, y, x, path) {
  //console.log(`Beam at ${y},${x}`);
  map[y][x]='|'; // mark beam path
  y=y+1; // tachbyon beam always travels downwards
  path=path+'d';

  if (y>=map.length) {
    paths.set(path, true);
    return 1;
  }
  if (map[y][x]==='^') { // divide
    // left beam
    var left=0;
    if (x>0) { 

      left=tachyonBeam(map, y, x-1, path+'l');
    }

    // right beam
    var right=0;
    if (x<map[0].length-1) {
      right=tachyonBeam(map, y, x+1, path+'r');
    }

    return 2;
  } else {
    return tachyonBeam(map, y, x, path);
  }

}
console.log(tachyonBeam(map, sy, sx,''));
p2=paths.size;
for (const line of map) {
  console.log(line.join(''));
}



console.log("Part 1:", p1);
console.log("Part 2:", p2);
