const input = require('fs').readFileSync(0).toString().trim(); 

let i=0;

let blocks="";

for (r of input) {
  if (i%2==0) {
    console.log(String(Math.floor(i/2)).repeat(r));
    blocks=blocks+String(Math.floor(i/2)).repeat(r);
  } else {
    console.log(".".repeat(r));
    blocks=blocks+".".repeat(r);
  }
  i++;
}

console.log(blocks);

let original_length=blocks.length;


// moving phase
while (blocks.match(/\./)) {

  last_block=blocks.slice(-1);
  blocks=blocks.slice(0,-1);

  blocks=blocks.replace(/\./, last_block);
  //console.log(blocks);

  //if (i--<=0) { console.log("unc exit");  process.exit(); };

}

// fill rest
blocks=blocks+".".repeat(original_length-blocks.length);
console.log(blocks);

// calculate checksum
let checksum=0;
i=0;
for (block of blocks) {
  if (block.match(/\d/))
    checksum+=i*Number(block);
  i++;
}

console.log("Checksum", checksum);
