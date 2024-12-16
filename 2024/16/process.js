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

const pqValues = [];

function pqEnqueue(element, priority) {
    pqValues.push({element, priority});
    pqValues.sort((a, b) => a.priority - b.priority);
}

function pqDequeue() {
    return pqValues.shift();
}

let y=0;
for (const line of input.split("\n")) {
  if (line.match(/^#/)) {
    map.push(line.split(""));
    if (line.indexOf('S')>=0) { Sp[0]=y; Sp[1]=line.indexOf('S'); };
    if (line.indexOf('E')>=0) { Ep[0]=y; Ep[1]=line.indexOf('E'); };
    y++;
  }
}

Sp[2]=1; // facing east

drawMap(map);
console.log(Sp, Ep);

let ret=pqsolve();
console.log(ret[0], ret[1]);
drawMap(map,ret[0], ret[2]);


function calculatePathScore(path) {
  if (scorecache[path]) return scorecache[path];
  let score=0;
  for (const c of path) 
    score+=movePrices[c] || 0
  scorecache[path]=score;
  return score;
}

function drawMap(map,score,bc) {
  if (score && bc) {
    for (let el of [...bc.keys()]) {
      if (bc.get(el)<=score) {
        let n=el.split(',').map(Number);
        n.pop();
//        console.log('X',n);
      }; 
    };
  }
  let map2=structuredClone(map);
/*
  if (bc) {
    for (let el of bc.keys()) {
      console.log('key', bc);
    };
  };
*/
  for (const row of map2) {
    const line=row.join("");
    console.log(line);
  }
}

function pqsolve() {
  // State: [y, x, direction, cost, path]
  const startState = [...Sp, 0, 'S'];
  pqEnqueue(startState, 0);

  const bestCosts = new Map();
  bestCosts.set(`${Sp[0]},${Sp[1]},${Sp[2]}`, 0);

  while (pqValues.length !== 0) {
    const {element: [cy, cx, cdir, ccost, cpath]} = pqDequeue();

    if (cy == Ep[0] && cx == Ep[1]) {
      console.log("E with cost:", ccost);
      
      return [ccost, cpath, bestCosts];
    }

    // forward
    let [ny, nx] = [cy + directions[cdir][0], cx + directions[cdir][1]];
    if (map[ny][nx] == '.' || map[ny][nx] == 'E') {
      go(ny, nx, cdir, ccost + movePrices.f, cpath + 'f', bestCosts);
    }

    // rotate counterclockwise
    let ccwDir = cdir-1;
    if (ccwDir<0) ccwDir=3; // hardcoded
    [ny, nx] = [cy + directions[ccwDir][0], cx + directions[ccwDir][1]];
    if (map[ny][nx] == '.' || map[ny]?.[nx] == 'E') {
        go(ny, nx, ccwDir, ccost + movePrices.C + movePrices.f, cpath + 'Cf', bestCosts);
    }

    // clockwise
    let cwDir = (cdir + 1) % 4;
    [ny, nx] = [cy + directions[cwDir][0], cx + directions[cwDir][1]];
    if (map[ny][nx] == '.' || map[ny][nx] == 'E') {
        go(ny, nx, cwDir, ccost + movePrices.R + movePrices.f, cpath + 'Rf', bestCosts);
    }
  }


}

function go(ny, nx, ndir, ncost, npath, bestCosts) {
   const stateKey = `${ny},${nx},${ndir}`;
    const currentBest = bestCosts.get(stateKey) ?? Infinity;
    
    if (ncost < currentBest) {
        bestCosts.set(stateKey, ncost);
        pqEnqueue([ny, nx, ndir, ncost, npath], ncost);
    }  
}

function canWeGoTo(map,y,x) {
  console.log(x,y,'has',map[y][x]);
  console.log(map[y].join(""));
  if (map[y][x]=='.') return true;
  if (map[y][x]=='E') return true;
  return false;
}

