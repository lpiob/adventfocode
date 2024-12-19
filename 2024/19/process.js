const input = require('fs').readFileSync(0).toString().trim(); 

let pq = [];
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
  console.log('searching for', design, "from",patterns.length,"combinations");
  let ret=pqsolve(design, patterns);

  if (ret>0) sum++;
  sum2+=ret;
}

console.log('possible designs:', sum);
console.log('possible step2 designs:', sum2);

function buildPatternIndex(design, patterns) {
  const positionPatterns = new Array(design.length).fill(null).map(() => []);
  
  for (const pattern of patterns) {
    for (let pos = 0; pos <= design.length - pattern.length; pos++) {
      if (design.substring(pos, pos + pattern.length) === pattern) {
        positionPatterns[pos].push(pattern);
      }
    }
  }
  
  return positionPatterns;
}

function pqsolve(design, patterns) {
  pq=[];
  pqVisited.clear();
  // State: [current_pattern, current_comma_path]
  const startState = ['', ''];
  pq.push(startState);
  pqVisited.add('');
  let bestPaths = 0;

  let patternIndex=buildPatternIndex(design, patterns);
  console.log(patternIndex);

  while (pq.length !== 0) {
    const [cpath, ccpath] = pq.pop();

    if (cpath==design) {
      bestPaths++;
      continue;
    }

    if (cpath.length>design.length) {
      continue;
    }

    for (const p of patternIndex[cpath.length]) {
      const ncpath=ccpath+','+p;
      const npath=cpath+p;
      
      if (npath.length>design.length) continue;
      if (design.indexOf(npath)===0) { 
        pq.push([npath, ncpath]);
      }
    };
  }
  return bestPaths;
}

