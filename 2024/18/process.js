const input = require('fs').readFileSync(0).toString().trim(); 

const width=Number(process.argv[2]);
const height=Number(process.argv[3]);
const ns=Number(process.argv[4]);

if (!width || !height || !ns ) {
  console.log(`Use ${process.argv[0]} ${process.argv[1]} <width> <height> <nanoseconds> < input`);
  process.exit(1);
};

// x,y in input, y,x in program but it should not matter as we're in a square
const map = Array(height+1).fill().map(() => Array(width+1).fill('.'));

var scorecache={};
let lowest_known_score;

Sp=[0,0]
Ep=[height, width]

const pqValues = [];

//drawMap(map);

let corruptedQueue=[];
let i=0;
for (let el of input.split("\n")) {
  let c=el.split(",").map(Number).reverse();
  corruptedQueue.push(c);
  if (i<ns) {
    map[c[0]][c[1]]='#';
  };
  i++;
};

drawMap(map);

console.log(Sp, Ep);

let ret=pqsolve();
//console.log("finished with", ret);

console.log("Minimal number of steps: ", ret[0])

drawMap(map,ret[2]);

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

function pqsolve() {
  // State: [y, x, cost, path]
  const startState = [...Sp, 0, ''];
  pqEnqueue(startState, 0);

  const bestCosts = new Map();
  bestCosts.set(`${Sp[0]},${Sp[1]}`, 0);

  let bestEndCost = Infinity;
  let bestPaths = [];

  while (pqValues.length !== 0) {
    const {element: [cy, cx, ccost, cpath]} = pqDequeue();

    if (ccost > bestEndCost) continue;    

    if (cy == Ep[0] && cx == Ep[1]) {
      if (ccost < bestEndCost) {
        bestEndCost = ccost;
        bestPaths = [cpath];
      } else if (ccost === bestEndCost) {
        bestPaths.push(cpath);
        console.log("E with cost:", ccost);
      }      
    }

    // up
    let [ny, nx] = [cy-1, cx];
    if (ny>=0) {
      if (map[ny][nx] == '.') {
        go(ny, nx, ccost + 1, cpath + 'U', bestCosts);
      }
    };
    // down
    [ny, nx] = [cy+1, cx];
    if (ny<=height) {
      if (map[ny][nx] == '.') {
        go(ny, nx, ccost + 1, cpath + 'D', bestCosts);
      }
    };
    // left
    [ny, nx] = [cy, cx-1];
    if (nx>=0) {
      if (map[ny][nx] == '.') {
        go(ny, nx, ccost + 1, cpath + 'L', bestCosts);
      }
    };
    // right
    [ny, nx] = [cy, cx+1];
    if (nx<=width) {
      if (map[ny][nx] == '.') {
        go(ny, nx, ccost + 1, cpath + 'R', bestCosts);
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

