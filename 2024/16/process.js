const input = require('fs').readFileSync(0).toString().trim(); 

const width=input.split("\n")[0].length;
const height=input.match(/^#/gms).length;
console.log(width, height);

var scorecache={};
let lowest_known_score;

const map=[];

let Sp=[]; // y, x, dir
let Ep=[];

const directions={
  0: [-1,0],   // N
  1: [0,1],    // E
  2: [1,0],    // S
  3: [0,-1]    // W
}

const movePrices={
  "f": 1,
  "C": 1000, // counterclockwise rotate
  "R": 1000 // clockwise rotate
}


let y=0;
for (const line of input.split("\n")) {
  if (line.match(/^#/)) {
    map.push(line.split(""));
    if (line.indexOf('S')>=0) { Sp[0]=y; Sp[1]=line.indexOf('S'); };
    if (line.indexOf('E')>=0) { Ep[0]=y; Ep[1]=line.indexOf('E'); };
    y++;
  }
  else if (line.match(/.+/)) {
    ops=[...ops, ...line.split("")]
  }
}

Sp[2]=1; // facing east

drawMap(map);
console.log(Sp, Ep);

visited=new Set();
let paths=go(map, Sp, 'S', visited);

let i=0;
for (const path of paths) {
  i++;
  let score=calculatePathScore(path);
  if (score==lowest_known_score)
  console.log('path',i,'score',score,path);
}


function calculatePathScore(path) {
  if (scorecache[path]) return scorecache[path];
  let score=0;
  for (const c of path) 
    score+=movePrices[c] || 0
  scorecache[path]=score;
  return score;
}

function drawMap(map) {
  for (const row of map) {
    const line=row.join("");
    console.log(line);
  }
}


function go(map, Sp, path='', visited) {
  visited.add(`${Sp[0]}x${Sp[1]}`);
  let current_score=calculatePathScore(path);

  let paths=[];
  //console.log('We are at',Sp[0],Sp[1], 'and we are facing', Sp[2]);
  // where can we go?
  let lr=Sp[2]; // current rotation

  // forward
  let [ny,nx]=[Sp[0]+directions[lr][0], Sp[1]+directions[lr][1]  ];
  if (!visited.has(`${ny}x${nx}`) && map[ny][nx]=='.')
    paths=[...paths, ...go(map, [ny, nx, Sp[2]], path+'f', new Set(visited))];
  else if (map[ny][nx]=='E') {// going forward would end in finish!
    paths.push(path+'fE');
    console.log(path+'fE');
    let score=calculatePathScore(path+'fE');
    if (!lowest_known_score || score<lowest_known_score) {
      lowest_known_score=score;
      console.log("New lowest known score", lowest_known_score);
    };
    return paths;
  }

  if (!lowest_known_score || current_score+1000<lowest_known_score) {
    // rotate counterclockwise
    lr--;
    if (lr<0) lr=3; // hardcoded
    [ny,nx]=[Sp[0]+directions[lr][0], Sp[1]+directions[lr][1]  ];
    if (!visited.has(`${ny}x${nx}`) && map[ny][nx]=='.') {
      paths=[...paths, ...go(map, [ny, nx, lr], path+'Cf', new Set(visited))];
    }

    // rotate clockwise
    lr--;
    if (lr<0) lr=3; // hardcoded
    lr--;
    if (lr<0) lr=3; // hardcoded
    [ny,nx]=[Sp[0]+directions[lr][0], Sp[1]+directions[lr][1]  ];
    if (!visited.has(`${ny}x${nx}`) && map[ny][nx]=='.')
      paths=[...paths, ...go(map, [ny, nx, lr], path+'Rf', new Set(visited))];
  };

  //@TODO situation when rotating would result in meeting E
  //paths.push(path); // @todo limit to those ending on E
  return paths;
}

function canWeGoTo(map,y,x) {
  console.log(x,y,'has',map[y][x]);
  console.log(map[y].join(""));
  if (map[y][x]=='.') return true;
  if (map[y][x]=='E') return true;
  return false;
}
