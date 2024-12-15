const input = require('fs').readFileSync(0).toString().trim(); 

let ocean={};
for (let nf of input.split(",").map(Number)) {
  console.log(nf);
  ocean[nf]=(ocean[nf] || 0)+1;
};

for (let i=1;i<=256;i++) {
  // a 0 becomes a 6 and adds a new 8 to the end of the list
  const prev0=(ocean[0] || 0)
  ocean[0]=0;

  // while each other number decreases by 1 if it was present at the start of the day
  for (let d=1;d<=8;d++) {
    ocean[d-1]=(ocean[d-1] || 0) + (ocean[d] || 0);
    ocean[d]=0;
  };
  
  // a 0 becomes a 6 and adds a new 8 to the end of the list
  ocean[6]=(ocean[6] || 0) + prev0;
  ocean[8]=(ocean[8] || 0) + prev0;
  // calc sum
  let sum=0;
  for (let d=0;d<=8;d++) sum+=(ocean[d] || 0)
  console.log(i, sum);
};
