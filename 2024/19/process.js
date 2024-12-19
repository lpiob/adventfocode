const input = require('fs').readFileSync(0).toString().trim(); 

let pqValues = [];
let pqVisited = new Set();

const lines = input.split("\n");
let patterns=lines.shift().split(", ")
lines.shift(); // empty line
let desired_designs=lines;

var scorecache={};
let lowest_known_score;


let sum=0;
let sum2=0;
for (const design of desired_designs) 
{

  console.log('searching for', design);
  let ret=pqsolve(design, patterns);

  console.log(design, ret);
  if (ret.length>0) sum++;
  sum2+=ret.length;
}

console.log('possible designs:', sum);
console.log('possible step2 designs:', sum2);

function pqsolve(design, patterns) {
  pqValues=[];
  pqVisited.clear();
  // State: [cost, current_pattern, current_comma_path]
  const startState = [0, '', ''];
  pqEnqueue(startState, 0);
  pqVisited.add('');
  let bestPaths = [];


  while (pqValues.length !== 0) {
    const {element: [cost, cpath, ccpath]} = pqDequeue();
    console.log('trying',ccpath);

    if (cpath==design) {
      bestPaths.push(ccpath);
      continue;
    }

    if (cpath.length>design.length) {
      continue;
    }

    for (const p of patterns) {
      //const ncpath=ccpath+(ccpath.length>0?',':'')+p;
      const ncpath=ccpath+','+p;
      const npath=cpath+p;
      if (pqVisited.has(ncpath)) continue;
      if (npath.length>design.length) continue;
      if (design.startsWith(npath)) {
        pqEnqueue([cost+1, npath, ncpath], cost+1);
        pqVisited.add(ncpath);
      }
    };

  }
  return bestPaths;
}

function pqEnqueue(element, priority) {
    pqValues.push({element, priority});
    pqValues.sort((a, b) => a.priority - b.priority);
}

function pqDequeue() {
    return pqValues.shift();
}

