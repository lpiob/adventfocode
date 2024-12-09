const input = require('fs').readFileSync(0).toString().trim(); 

let i=0;

let blocklist=[];

for (r of input) {
  if (i%2==0) {
    for (let i2=0; i2<r; i2++) {
      blocklist.push(Math.floor(i/2));
    }
  } else {
    for (let i2=0; i2<r; i2++) {
      blocklist.push(".");
    }
  }
  i++;
}

let blocks=blocklist.join("");

let original_length=blocklist.length;


// moving phase
while (blocklist.indexOf(".")>=0) {
  last_block=blocklist.pop();
  blocklist[blocklist.indexOf(".")]=last_block;
}

// fill rest
for (i=blocklist.length; i<original_length; i++)
  blocklist.push(".");

blocks=blocklist.join("");

console.log(blocks);

// calculate checksum
let checksum=0;
for (i=0; i<blocklist.length; i++) {
  if (blocklist[i]!=".")
    checksum+=i*Number(blocklist[i]);
}

console.log("Checksum", checksum);
