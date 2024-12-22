const input = require('fs').readFileSync(0).toString().trim(); 

let sum=0;
for (let secret of input.split("\n")) {
  let n=secret;
  for (let i=0;i<2000;i++)
    n=calculateNextSecret(n);
  console.log(secret, n);
  sum+=n;
};

console.log("sum", sum);

function calculateNextSecret(n) {
  const m = (1<<24)-1
  n = (n ^ n<<6) & m;
  n = (n ^ n>>>5) & m;
  n = (n ^ n<<11) & m;
  return n;
};


