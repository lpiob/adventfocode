const input = require('fs').readFileSync(0).toString();
const lines = input.trim().split('\n');

let safe_inputs=[]

function allAscending(l) {
    for (i=1; i<l.length; i++) {
      if (l[i]<=l[i-1]) { 
        console.log("not all ascending, because ", l[i], "<=", l[i-1]);
        return false;
      }
    }
    return true;
}
function allDescending(l) {
    for (i=1; i<l.length; i++) {
      if (l[i]>=l[i-1]) {
        console.log("not all descending, because ", l[i], ">=", l[i-1]);
        return false;
      }
    }
    return true;
}

function isListSafe(l) {
    for (i=1; i<l.length; i++) {
    
      if (Math.abs(l[i]-l[i-1])<1) { console.log("ils1r1"); return false; }
      if (Math.abs(l[i]-l[i-1])>3) { console.log("ils1r2"); return false; }
    };

 
    if (allAscending(l) || allDescending(l)) return true;

    return false;
}

function problemDamper(l){
  let l2=[];
  for (let i=0; i<l.length; i++) {
    l2.push( l.filter((_, index) => index !== i) );
  };
  console.log("pD", l2);
  return l2;

}

// reading input
for (const line of lines) {
    const numbers = line.trim().split(/\s+/).map(Number);
    console.log(numbers);
    const dampened=problemDamper(numbers);
    if (isListSafe(numbers) || dampened.some(numbers2 => isListSafe(numbers2)))
      safe_inputs.push(numbers);
}

console.log("Safe reports: ",safe_inputs.length);

