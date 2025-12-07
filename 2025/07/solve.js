const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;

const map = [];

for (const lines of input.split('\n')) {
  map.push(lines.split(''));
}

let sy=0;
let sx=map[0].indexOf('S');
// first beam
map[sy+1][sx]='|';

let splits=0;
let splits_by_row=[];
let active_splitters=0;

for (let y=0;y<map.length;y++) {
  if (!splits_by_row[y]) splits_by_row[y]=0;
  for (let x=0;x<map[0].length;x++) {
    if (map[y][x]==='.') {
      if (y>0 && map[y-1][x]==='|') {
        map[y][x]='|';
      }
    } else if (map[y][x]==='^') {
      console.log('splitter at ', y,x);

      if (map[y-1][x]==='|') {
        active_splitters++;
        // left beam
        if (x-1 >= 0 && map[y][x-1]==='.') {
          map[y][x-1]='|';
          p1++;
          splits_by_row[y]++;
        }
        // right beam
        if (x+1 < map[0].length && map[y][x+1]==='.') {
          map[y][x+1]='|';
          p1++;
          splits_by_row[y]++;
        }
      } else {
        console.log('This splitter is inactive!');
      }
    };
  }
}

let y=0;
for (const line of map) {
  console.log(line.join(''), splits_by_row[y]);
  y++;
}
console.log('active splitters:', active_splitters);

console.log("Part 1:", active_splitters);
console.log("Part 2:", p2);
