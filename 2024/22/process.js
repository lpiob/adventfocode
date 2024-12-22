const input = require('fs').readFileSync(0).toString().trim(); 

let allsequences={};

let sum=0;
for (let secret of input.split("\n")) {
  //secret=123;
  let n=secret;
  let changes=[n%10]
  for (let i=0;i<2000;i++) {
    n=calculateNextSecret(n);
    let digit=n%10;

    changes.push(digit);
    if (changes.length>5) changes.shift();

    let diffs=[];
    for (let i2=1;i2<changes.length;i2++) {
      diffs.push(changes[i2]-changes[i2-1]);
    };

    //console.log(i,n,digit, changes, diffs);
    if (diffs.length>=4) {
      const diffkey=diffs.join(",")
      if (!allsequences[diffkey]) {
        console.log("Selling at",diffkey,"would yield",digit,"bananas")
        allsequences[diffkey]=(allsequences[diffkey]||0)+digit;
      };
    };


  };
  console.log(secret, n);
  sum+=n;

};
console.log(allsequences);
console.log("sum", sum);
const bestdiff = Object.keys(allsequences).reduce((maxKey, currentKey) => 
    allsequences[maxKey] >= allsequences[currentKey] ? maxKey : currentKey
);

console.log("best change sequence", bestdiff);


function calculateNextSecret(n) {
  const m = (1<<24)-1
  n = (n ^ n<<6) & m;
  n = (n ^ n>>>5) & m;
  n = (n ^ n<<11) & m;
  return n;
};


