const input = require('fs').readFileSync(0).toString().trim(); 

const map = [];

for (const lines of input.split('\n')) {
  map.push(lines.split(''));
}

let sy=0;
let sx=map[0].indexOf('S');

const beams = {};
beams[sx] = 1;
let splits = 0;

for (let y = 0; y < map.length - 1; y++) {
  for (const [x, count] of Object.entries(beams).map(([k, v])=>[Number(k), v])) {
    if (map[y+1][x]==='^') {
      beams[x-1]=(beams[x-1]||0) + count;
      beams[x+1]=(beams[x+1]||0) + count;
      delete beams[x];
      splits++;
    }
  }
}

console.log("Part 2:", Object.values(beams).reduce((a, b) => a + b, 0));
