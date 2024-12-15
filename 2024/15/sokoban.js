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

drawMap(map);
console.log(ops);
console.log(px,py);

for (const op of ops) {
  let [ret,ny,nx]=move(py, px, op);
  py=ny
  px=nx
  console.log(op, ret);
  drawMap(map);
}

// step1 result
let s1sum=0;
for (let y=0; y<height; y++) {
  for (let x=0; x<width; x++) {
    if (map[y][x]=='O') {
      s1sum+=100*y+x;
    };
  };
};

console.log("s1sum", s1sum);

function drawMap(map) {
  for (const row of map) {
    const line=row.join("");
    console.log(line);
  }
}

function move(cy,cx, dir) {
  const movevectors={
    //       y,  x
    '<': [  0, -1 ],
    '^': [ -1,  0 ],
    '>': [  0,  1 ],
    'v': [  1,  0 ]
  }

  if (!movevectors[dir]) throw new Error('invalid direction!', dir);

  let ny=cy+movevectors[dir][0]
  let nx=cx+movevectors[dir][1]

  if (map[ny][nx]=='#') return [false, cy, cx];
  if (map[ny][nx]=='.') {
    map[ny][nx]=map[cy][cx];
    map[cy][cx]="."; // this is a good place for a step2 twist
    return [true, ny, nx];
  };
  if (map[ny][nx]=='O') { // push!
    let [ret, my, mx]=move(ny,nx, dir);
    if (ret) {
      map[ny][nx]=map[cy][cx];
      map[cy][cx]="."; // this is a good place for a step2 twist
      return [ret, ny, nx];
    } else {
      return [false, cy, cx];
    };
  };


};
