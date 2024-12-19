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
  const custom_patterns=structuredClone(patterns);

  for (let i=custom_patterns.length-1;i>=0;i--) {
    let p=custom_patterns[i]
    if (!design.includes(p)) {
      custom_patterns.splice(i,1);
    };
  };

  console.log('searching for', design, "from",patterns.length,'=>',custom_patterns.length, "combinations");
  let ret=pqsolve(design, custom_patterns);

  //console.log(design, ret);
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
  //console.log(patternIndex);

  while (pq.length !== 0) {
    const [cpath, ccpath] = pq.pop();
    //console.log('trying',ccpath);

    if (cpath==design) {
      //bestPaths.push(ccpath);
      bestPaths++;
      continue;
    }

    if (cpath.length>design.length) {
      continue;
    }

    //console.log('cpath',cpath);
    //console.log('cpath.length-1=', cpath.length);
    //console.log('pi[^]=', patternIndex [ cpath.length ]);
    //for (const p of patterns) {
    for (const p of patternIndex[cpath.length]) {
      //const ncpath=ccpath+(ccpath.length>0?',':'')+p;
      const ncpath=ccpath+','+p;
      const npath=cpath+p;
      /* 
      if (pqVisited.has(ncpath)) {
        console.log('we were here already!', ncpath);
        process.exit(0);
        continue;
      };
      */
      
      if (npath.length>design.length) continue;
      //if (design.startsWith(npath)) {
      if (design.indexOf(npath)===0) { // faster
      //if (design.slice(0,npath.length)==npath) { // faster
        pq.push([npath, ncpath]);
        //pqVisited.add(ncpath);
        //console.log(pqVisited);
      }
    };
    //console.log(pq.values.length, bestPaths.length);
  }
  return bestPaths;
}

