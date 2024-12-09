const input = require('fs').readFileSync(0).toString().trim(); 

let i=0;

let blocklist=[];

for (r of input) {
  if (i%2==0) {
    //console.log(String(Math.floor(i/2)).repeat(r));
    for (let i2=0; i2<r; i2++) {
      blocklist.push(Math.floor(i/2));
    }
  } else {
    //console.log(".".repeat(r));
    for (let i2=0; i2<r; i2++) {
      blocklist.push(".");
    }
  }
  i++;
}

let blocks=blocklist.join("");

console.log(blocks);

let original_length=blocklist.length;


// moving phase
while (blocklist.indexOf(".")>=0) {
  last_block=blocklist.pop();
  blocklist[blocklist.indexOf(".")]=last_block;
  
//  blocks=blocklist.join("");
//  console.log(blocks);
/*
  last_non_free_block=blocks.match(/[^\.]\.*$/)
  last_block=blocks.charAt(last_non_free_block.index
  blocks=blocks.slice(0,last_non_free_block.index)+blocks.slice(last_non_free_block.index+1);
*/


  //if (i--<=0) { console.log("unc exit");  process.exit(); };

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
