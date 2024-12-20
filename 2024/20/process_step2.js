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
let ret=solve(Sp, Ep, '#');
console.log('Target reached in ', ret[0], 'picoseconds');
//console.log(ret[1]);
drawMap(map, ret[1]);

steps=ret[1][0];

let min_shortcut=50;

let shaves={};
let possible_cheats=new Set();
let total_cheats=0;

let possible_shortcuts=0;
for (let i1=0; i1<steps.length-min_shortcut; i1++) {
  c1=steps[i1];
  for (let i2=i1+min_shortcut; i2<steps.length; i2++) {
    c2=steps[i2];
    let saved=i2-i1-3+1;
    if (saved>=min_shortcut) {
      // manhattan distance
      if ( Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]) <20 ) {
          const key=`${c1[0]}x${c1[1]}-${c2[0]}x${c2[1]}`;
          if (!possible_cheats.has(key)) {
            let ret=solve(c1, c2, '.');
            if (ret[0]<=min_shortcut) {
              shaves[saved]=(shaves[saved]||0)+1;
              total_cheats++;
              possible_cheats.add(key);
              if (saved==51 && false) {
                console.log(i1,i2,c1,c2, 'saves',saved);
                drawMap(map, ret[1]);
                process.exit(0);
              };
            };
          };
      };
    };
  };
};

console.log(shaves);
console.log("Total shortcuts that save",min_shortcut,":",total_cheats);
console.log(possible_cheats.size);


function drawMap(map,bc) {
  console.log('01234567890123456');
  let map2=structuredClone(map);
  if (bc && bc instanceof Map) {
    for (let el of bc) {
      let n=el[0].split(',').map(Number);
      map2[n[0]][n[1]]="O";
    };
  } else if (bc && bc instanceof Array) {
    for (let n of bc[0]) {
      map2[n[0]][n[1]]="O";
    };
  };

  for (const row of map2) {
    const line=row.join("");
    console.log(line);
  }
}

function solve(Sp, Ep, wall) {
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
      if (cost < bestEndCost) {
        bestEndCost = cost;
        bestPaths = [path];
      } else if (cost === bestEndCost) {
        bestPaths.push(cpath);
      }      
    }

    // up
    let [ny, nx] = [cy-1, cx];
    if (ny>=0) {
      if (map[ny][nx] != wall) {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
    // down
    [ny, nx] = [cy+1, cx];
    if (ny<height) {
      if (map[ny][nx] != wall) {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
    // left
    [ny, nx] = [cy, cx-1];
    if (nx>=0) {
      if (map[ny][nx] != wall) {
        go(ny, nx, cost + 1, [...path, [ny,nx]], bestCosts);
      }
    };
    // right
    [ny, nx] = [cy, cx+1];
    if (nx<width) {
      if (map[ny][nx] != wall) {
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

