const input = require('fs').readFileSync(0).toString().trim(); 

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(element, priority) {
    this.values.push({ element, priority });
    this._bubbleUp();
  }

  dequeue() {
    if (this.values.length === 0) return null;
    
    const min = this.values[0];
    const end = this.values.pop();
    
    if (this.values.length > 0) {
      this.values[0] = end;
      this._sinkDown();
    }
    
    return min;
  }

  _bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      
      if (element.priority >= parent.priority) break;
      
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  _sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;
      
      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) || 
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      
      if (swap === null) break;
      
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }

  get length() {
    return this.values.length;
  }
}

let pq = new PriorityQueue();
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

  console.log(design, ret);
  if (ret.length>0) sum++;
  sum2+=ret.length;
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
  pq=new PriorityQueue();
  pqVisited.clear();
  // State: [cost, current_pattern, current_comma_path]
  const startState = [0, '', ''];
  pq.enqueue(startState, 0);
  pqVisited.add('');
  let bestPaths = [];

  let patternIndex=buildPatternIndex(design, patterns);
  console.log(patternIndex);

  while (pq.length !== 0) {
    const {element: [cost, cpath, ccpath]} = pq.dequeue();
    //console.log('trying',ccpath);

    if (cpath==design) {
      bestPaths.push(ccpath);
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
      if (pqVisited.has(ncpath)) continue;
      if (npath.length>design.length) continue;
      if (design.startsWith(npath)) {
        pq.enqueue([cost+1, npath, ncpath], cost+1);
        pqVisited.add(ncpath);
      }
    };

  }
  return bestPaths;
}

