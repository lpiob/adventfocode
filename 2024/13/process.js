const input = require('fs').readFileSync(0).toString().trim(); 
const path_cost_cache = {};
const button_costs={
  "A": 3,
  "B": 1
}

let total_tokens=0;

let count=0;
for (const el of input.split('\n\n')) {
  
  const a_matches=el.match(/A: X\+(\d+), Y\+(\d+)/);
  button_a=[Number(a_matches.pop()), Number(a_matches.pop())]; // switching order, y first
  
  const b_matches=el.match(/B: X\+(\d+), Y\+(\d+)/);
  button_b=[Number(b_matches.pop()), Number(b_matches.pop())]; // switching order, y first

  const p_matches=el.match(/Prize: X=(\d+), Y=(\d+)/);
  const prize_location=[Number(p_matches.pop()), Number(p_matches.pop())];
  console.log(button_a, button_b, prize_location);

  const min_presses=findminbp2d(prize_location, button_a, button_b);
  if (min_presses>=0)
    total_tokens+=min_presses;
  console.log(min_presses, count++);
}

console.log("total", total_tokens);

function pathcost(path) {
  if (path=='') return 0;
  if (path!==null) {
    if (path_cost_cache[path]) return path_cost_cache[path];
    let sum=0;
    for (const c of path)
      sum+=button_costs[c]
    path_cost_cache[path]=sum;
    return sum;
  }
  return null;
}

console.log("pathcost from root", pathcost("A"));

function findminbp2d(target, a_offset, b_offset) {
    console.log(a_offset);
    if (findminbp(target[0], [ a_offset[0], b_offset[0] ])<0) return -1;
    if (findminbp(target[1], [ a_offset[1], b_offset[1] ])<0) return -1;
    const maxX = target[0];// + Math.max(a_offset[0], b_offset[0]);
    const maxY = target[1];// + Math.max(a_offset[1], b_offset[1]);
    
    const dp = Array(maxX + 1).fill(null)
        .map(() => Array(maxY + 1).fill(null));
    
    // Base case: origin requires 0 presses
    dp[0][0] = '';
    
    // Track minimum steps needed to reach target
    let targetSteps=-1;
    const y_gcd=findGCD(a_offset[1],b_offset[1]);
    const x_gcd=findGCD(a_offset[0],b_offset[0]);
    console.log("GCD:",y_gcd,x_gcd);
    for (let x = 0; x <= maxX; x=x+x_gcd) {
      for (let y = 0; y <= maxY; y=y+y_gcd) {
            // Skip if we haven't reached this point yet
            if (pathcost(dp[x][y]) !== null) {
                const currentSteps = pathcost(dp[x][y]);
                
                // Try button A
                const newAX = x + a_offset[0];
                const newAY = y + a_offset[1];
                if (newAX <= maxX && newAY <= maxY) {
                    if (pathcost(dp[newAX][newAY]) === null || pathcost(dp[newAX][newAY])>currentSteps ) {
                      dp[newAX][newAY] = dp[x][y]+'A';
                    }
                }
                
                // Try button B
                const newBX = x + b_offset[0];
                const newBY = y + b_offset[1];
                if (newBX <= maxX && newBY <= maxY) {
                    if (pathcost(dp[newBX][newBY]) === null || pathcost(dp[newBX][newBY])>currentSteps ) {
                      dp[newBX][newBY] = dp[x][y]+'B';
                    }
                }
                
                if (x === target[0] && y === target[1])
                    targetSteps = currentSteps;
            }
        }
    }
    return pathcost(dp[target[0]][target[1]]);
}

function findGCD(a, b) {
    if (b === 0) {
        return a;
    }
    
    return findGCD(b, a % b);
}

function findminbp(target, el) {
    console.log("minbp",target,el);
    let dp = Array(target + 1).fill(Infinity);
    dp[0] = 0;

    for (let e of el) {
        for (let i = e; i <= target; i++) {
            dp[i] = Math.min(dp[i], dp[i - e] + 1);
        }
    }

    return dp[target] === Infinity ? -1 : dp[target];
}
