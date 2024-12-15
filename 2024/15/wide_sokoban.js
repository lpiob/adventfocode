const input = require('fs').readFileSync(0).toString().trim(); 

const width=input.split("\n")[0].length*2;
const height=input.match(/^#/gms).length;
console.log(width, height);

const map=[];
let ops=[];

let px,py;

let y=0;
for (let line of input.split("\n")) {
  if (line.match(/^#/)) {
    line=line.replace(/#/g,"##").replace(/O/g, "[]").replace(/\./g,"..").replace(/@/g, "@.")
    map.push(line.split(""));
    if (line.indexOf('@')>=0) { py=y; px=line.indexOf('@'); };
    y++;
  }
  else if (line.match(/.+/)) {
    ops=[...ops, ...line.split("")]
  }
}

drawMap(map);

let i=0;
for (const op of ops) {
  let [ret,ny,nx]=move(py, px, op, map);
  if (ret) {
    py=ny
    px=nx
  }
  //console.log(op, ret);
  drawMap(map);
  i++;
  //if (i>18) process.exit();
}

// step1 result
let s1sum=0;
for (let y=0; y<height; y++) {
  for (let x=0; x<width; x++) {
    if (map[y][x]=='[') {
      s1sum+=100*y+x;
    };
  };
};

console.log("s1sum", s1sum);

function drawMap(map) {
  let y=0;
  for (const row of map) {
    const line=row.join("");
    console.log(line + ' ' + (y++));
  }
  console.log('012345678901234567890');
  console.log('0         1          ');
}

function move(cy,cx, dir, map) {
  console.log('move', cy, cx, dir);
  console.log('map at this location:', map[cy][cx]);
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
  else if (map[ny][nx]=='.') {
    map[ny][nx]=map[cy][cx];
    map[cy][cx]=".";
    return [true, ny, nx];
  } else if ((dir=='<' || dir=='>')) { // push!
    let [ret, my, mx]=move(ny,nx, dir, map);
    if (ret) {
      map[ny][nx]=map[cy][cx];
      map[cy][cx]="."; // this is a good place for a step2 twist
      return [ret, ny, nx];
    } else {
      return [false, cy, cx];
    };
  } else if ((dir=='^' || dir=='v')) { // push!
    // let's first check the current vertical line on a copy
    let [ret, my, mx]=move(ny,nx, dir, structuredClone(map));
    if (ret) {
      console.log('col',nx,'can move');
      // let's now check a row to the side
      let ss = map[ny][nx]==']' ? -1 : 1;
      console.log('checking if col',nx+ss,'can move at row', nx);
      let [ret2, my2, mx2] = move(ny, nx+ss, dir, structuredClone(map));
      if (ret2) {
        console.log('col',nx+ss,'can move');
        // let's make the move on real map
        move(ny,nx, dir, map);
        move(ny,nx+ss, dir, map);
        map[ny][nx]=map[cy][cx];
        map[cy][cx]="."; // this is a good place for a step2 twist
        return [ret, ny, nx];
      }
      // only one row can move, we don't make any move
      return [false, ny, nx];
    }
    // no rows can move
    return [false, ny, nx];
  };

};
