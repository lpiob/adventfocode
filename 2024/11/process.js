const input = require('fs').readFileSync(0).toString().trim(); 

let stones=[];
for (el of input.split(" ")) {
  stones.push(Number(el));
}

console.log("input",stones);

for (let i=1;i<=75; i++) {
  blink(stones);
  console.log(i, stones.length);
}

function blink(stones) {
  for (let i=stones.length-1; i>=0; i--) {
    if (stones[i]==0) {
      stones[i]=1;
    } else if (String(stones[i]).length%2==0) {
      const engraving=String(stones[i])
      const length=Number(engraving.length);

      stones[i]=Number(engraving.slice(0, length/2));
      stones.splice(i+1, 0, Number(engraving.slice(-length/2)));
    } else {
      stones[i]*=2024;
    }
    //console.log(i);
  }
}
