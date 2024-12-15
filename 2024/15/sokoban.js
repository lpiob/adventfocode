const input = require('fs').readFileSync(0).toString().trim(); 

const width=input.split("\n")[0].length;
const height=input.match(/^#/gms).length;
console.log(width, height);

const map=[];
let ops=[];

let px,py;

let y=0;
for (const line of input.split("\n")) {
  if (line.match(/^#/)) {
    map.push(line.split(""));
    if (line.indexOf('@')>=0) { py=y; px=line.indexOf('@'); };
    y++;
  }
  else if (line.match(/.+/)) {
    ops=[...ops, ...line.split("")]
  }
}

map[py][px]='.';

drawMap(map);
console.log(ops);
console.log(px,py);

for (const op of ops) {
  let ret=move(op);
  console.log(op, ret);
  drawMap(map);
}

function drawMap(map) {
  let y=0;
  for (const row of map) {
    let newrow=[...row];
    if (py==y) newrow[px]='@';
    const line=newrow.join("");
    console.log(line);
    y++;
  }
}

function move(dir) {
  const movevectors={
    //       y,  x
    '<': [  0, -1 ],
    '^': [ -1,  0 ],
    '>': [  0,  1 ],
    'v': [  1,  0 ]
  }

  if (!movevectors[dir]) throw new Error('invalid direction!', dir);

  let ny=py+movevectors[dir][0]
  let nx=px+movevectors[dir][1]

  if (map[ny][nx]=='#') return false;
  if (map[ny][nx]=='.') {
    py=ny;
    px=nx;
    return true;
  };
  if (map[ny][nx]=='O') { // push!

  };


};
