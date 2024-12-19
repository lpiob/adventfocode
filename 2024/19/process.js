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
for (const design of desired_designs) 
{

  console.log('searching for', design);
  let ret=pqsolve(design, patterns);
  console.log(design, ret);
  if (ret) sum++;
}

console.log('possible designs:', sum);

function pqsolve(design, patterns) {
  pqValues=[];
  pqVisited.clear();
  // State: [cost, current_pattern]
  const startState = [0, ''];
  pqEnqueue(startState, 0);
  pqVisited.add('');

  while (pqValues.length !== 0) {
    const {element: [cost, cpath]} = pqDequeue();
    //console.log('list', pqValues);
    //console.log('trying',cpath);

    if (cpath==design) {
      return true;
    }

    if (cpath.length>design.length) {
      continue;
    }

    for (const p of patterns) {
      const npath=cpath+p;
      if (pqVisited.has(npath)) continue;
      if (npath.length>design.length) continue;
      if (design.startsWith(npath)) {
        pqEnqueue([cost+1, npath], cost+1);
        pqVisited.add(npath);
      }
    };

  }
  return false;
}

function pqEnqueue(element, priority) {
    pqValues.push({element, priority});
    pqValues.sort((a, b) => a.priority - b.priority);
}

function pqDequeue() {
    return pqValues.shift();
}

