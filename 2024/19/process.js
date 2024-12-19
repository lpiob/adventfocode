const input = require('fs').readFileSync(0).toString().trim(); 

let pq = [];

const lines = input.split("\n");
let patterns=lines.shift().split(", ")
lines.shift(); // empty line
let desired_designs=lines;

var scorecache={};
let lowest_known_score;
var solveCache = new Map();


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
  // State: [current_pattern, current_comma_path]
  const startState = ['', ''];
  pq.push(startState);

  let patternIndex = buildPatternIndex(design, patterns);

  function solveSubproblem(cpath) {
    const cacheKey = `${design}:${cpath}`;
    //console.log(cacheKey);
    
    if (solveCache.has(cacheKey)) {
      return solveCache.get(cacheKey);
    }

    let paths = 0;
    if (cpath === design) {
      paths = 1;
    } else if (cpath.length > design.length) {
      paths = 0;
    } else {
      for (const p of patternIndex[cpath.length] || []) {
        const npath = cpath + p;
        if (npath.length <= design.length && design.indexOf(npath) === 0) {
          paths += solveSubproblem(npath);
        }
      }
    }

    solveCache.set(cacheKey, paths);
    return paths;
  }

  return solveSubproblem('');
}
