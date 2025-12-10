const input=require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;

function solve(targetStates, buttons) {
  const rows=targetStates.length;
  const cols=buttons.length;
  
  let matrix=targetStates.map((target, row)=> {
    let r=buttons.map(btn=> btn.includes(row) ? 1 : 0);
    r.push(target);
    return r;
  });
  
  let pivotCols=[];
  let pivot=0;
  for (let col=0; col < cols && pivot < rows; col++) {
    let found=matrix.slice(pivot).findIndex(r=> r[col]===1);
    if (found===-1) continue;
    found +=pivot;
    
    [matrix[pivot], matrix[found]]=[matrix[found], matrix[pivot]];
    
    for (let row=0; row<rows;row++)
      if (row!==pivot && matrix[row][col]===1)
        matrix[row]=matrix[row].map((v, i)=> v^matrix[pivot][i]);
    pivotCols.push(col);
    pivot++;
  }
  
  const freeVars=[];
  for (let col=0; col < cols; col++)
    if (!pivotCols.includes(col)) freeVars.push(col);
  
  // find minimum presses
  let best=null;
  let bestCount=Infinity;
  
  for (let mask=0; mask < (1 << freeVars.length); mask++) {
    let sol=new Array(cols).fill(0);
    
    freeVars.forEach((col, i)=> {
      sol[col]=(mask>>i)&1;
    });
    
    for (let i=pivotCols.length - 1; i >=0; i--) {
      let row=i;
      let col=pivotCols[i];
      let val=matrix[row][cols];
      for (let j=col+1; j<cols; j++) {
        val ^=matrix[row][j]*sol[j];
      }
      sol[col]=val;
    }
    
    let count=sol.reduce((a, b)=> a+b, 0);
    if (count<bestCount) {
      bestCount=count;
      best=sol;
    }
  }
  return bestCount;
}

// example line
// [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
//

for (const line of input.split('\n')) {
  const targetStates=line.match(/\[.*?\]/)[0].slice(1, -1).split('').map(c=> c==='#' ? 1 : 0);
  const buttons=line.match(/\(.*?\)/g).map(s=> s.slice(1, -1).split(',').map(Number));
  const joltageRequirements=line.match(/\{.*?\}/)[0].slice(1, -1).split(',').map(Number);

  // perform gaussian elimination on the system of equations defined by targetStates and
  // buttons
  
  const sol=solve(targetStates, buttons);
  p1+=sol;

  console.log({targetStates, buttons, joltageRequirements});
  console.log("Solution:", sol);

}


console.log("Part 1:", p1);
console.log("Part 2:", p2);

// [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
// -> (0,3,4)
// [###.##]
// -> (0,1,2,4,5)
// [......]
//
//         b0  b1   b2   b3    b4    b5    b6
// [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
// -> (1,3)
// [..##]
// -> (2,3)
// [....]
// -> (0,1),(0,1)
// [....]
//
// [0,1,1,0]
// x0=0, x1=1, x2=1, x3=0
// target state is [0,0,0,0]
// for equations with buttons applying to each light
// for x0:
//   (x0 + b4 + b5)%2=0
// for x1:
//   (x1 + b1 + b5)%2=0
//for x2:
//   (x2 + b2 + b3)%2=0
//for x3:
//   (x3 + b0 + b1 + b3)%2=0
//
// after substituting known x values
// (0+b4+b5)%2=0
// (1+b1+b5)%2=0
// (1+b2+b3)%2=0
// (0+b0+b1+b3)%2=0
//
// shorthand notation
// b4 + b5=0
// b1 + b5=1
// b2 + b3=1
// b0 + b1 + b3=0
//
// matrix form
//        b0 b1 b2 b3 b4 b5 | result
//       0  0  0  0  1  1  | 0
//       0  1  0  0  0  1  | 1
//       0  0  1  1  0  0  | 1
//       1  1  0  1  0  0  | 0
// 

