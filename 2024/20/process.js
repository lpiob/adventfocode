const input = require('fs').readFileSync(0).toString().trim(); 

const width=input.split("\n")[0].length;
const height=input.match(/^#/gms).length;
console.log(width, height);

var scorecache={};
let lowest_known_score;

const map=[];

let Sp=[]; // y, x
let Ep=[];
let pqValues=[];

let y=0;
for (const line of input.split("\n")) {
  if (line.match(/^#/)) {
    map.push(line.split(""));
    if (line.indexOf('S')>=0) { Sp[0]=y; Sp[1]=line.indexOf('S'); };
    if (line.indexOf('E')>=0) { Ep[0]=y; Ep[1]=line.indexOf('E'); };
    y++;
  }
}

drawMap(map);
console.log(Sp, Ep);
let ret=solve();
console.log(ret[0], ret[1]);
drawMap(map, ret[2]);


function drawMap(map,bc) {
  let map2=structuredClone(map);
  if (bc) {
    for (let el of bc) {
      let n=el[0].split(',').map(Number);
      map2[n[0]][n[1]]="O";
    };
  }

  for (const row of map2) {
    const line=row.join("");
    console.log(line);
  }
}

function solve() {

  // State: [y, x, cost, path]
  const startState = [...Sp, 0, []];
  pqEnqueue(startState, 0);

  const bestCosts = new Map();
  bestCosts.set(`${Sp[0]},${Sp[1]}`, 0);

  let bestEndCost = Infinity;
  let bestPaths = [];

  while (pqValues.length !== 0) {
    const {element: [cy, cx, cost, path]} = pqDequeue();

    if (cost > bestEndCost) continue;    


    if (cy == Ep[0] && cx == Ep[1]) {
      console.log("got to finish");
      if (cost < bestEndCost) {
        bestEndCost = cost;
        bestPaths = [path];
      } else if (cost === bestEndCost) {
        bestPaths.push(cpath);
        console.log("E with cost:", cost);
      }      
    }

    // up
    let [ny, nx] = [cy-1, cx];
    if (ny>=0) {
      if (map[ny][nx] != '#') {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
    // down
    [ny, nx] = [cy+1, cx];
    if (ny<=height) {
      if (map[ny][nx] != '#') {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
    // left
    [ny, nx] = [cy, cx-1];
    if (nx>=0) {
      if (map[ny][nx] != '#') {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
    // right
    [ny, nx] = [cy, cx+1];
    if (nx<=width) {
      if (map[ny][nx] != '#') {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
  }
  return [bestEndCost, bestPaths, bestCosts];
}

function go(ny, nx, ncost, npath, bestCosts) {
  const stateKey = `${ny},${nx}`;
  const currentBest = bestCosts.get(stateKey) ?? Infinity;
    
  if (ncost < currentBest) {
    bestCosts.set(stateKey, ncost);
    pqEnqueue([ny, nx, ncost, npath], ncost);
  }  
}

function pqEnqueue(element, priority) {
    pqValues.push({element, priority});
    pqValues.sort((a, b) => a.priority - b.priority);
}

function pqDequeue() {
    return pqValues.shift();
}

