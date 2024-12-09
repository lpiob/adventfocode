const input = require('fs').readFileSync(0).toString().trim(); 


/*
 * These are not most optimal
 * and not even remotely clean implementations
 * these are implementations that I whip on a morning before work, 
 * with an approach to finish them as soon as possible.
*/

let blocklist=[];
let file_lengths=[];
let file_locations=[];
let known_free_spaces={};

let i=0;
for (r of input) {
  if (i%2==0) {
    for (let i2=0; i2<r; i2++) {
      blocklist.push(Math.floor(i/2));
    }
    file_lengths[Math.floor(i/2)]=r;
    file_locations[Math.floor(i/2)]=blocklist.length-r;
    //console.log("file", Math.floor(i/2), "is at", blocklist.length-r)
  } else {
    for (let i2=0; i2<r; i2++) {
      blocklist.push(".");
    }
  }
  i++;
}

const max_file_id=file_lengths.length-1;

let blocks=blocklist.join("");
console.log(blocks);

let original_length=blocklist.length;

// 0         1         2         3         4
// 012345678901234567890123456789012345678901
// 00...111...2...333.44.5555.6666.777.888899


// moving phase
for (i=max_file_id; i>=0; i--) {
  console.log("Moving file id", i, "of length", file_lengths[i]);
  const fsi=findFirstNRepetitions(blocklist, file_lengths[i], ".");
  if (fsi>=0 && fsi<file_locations[i]) {
    console.log("Continous free space found at ", fsi, "moving file")
    for (let i2=0; i2<file_lengths[i]; i2++) {
      console.log("from",file_locations[i]+i2,"to",fsi+i2);
      // copy
      blocklist[fsi+i2]=blocklist[file_locations[i]+i2];
      // overwrite old location
      blocklist[file_locations[i]+i2]=".";
    }
    file_locations[i]=fsi;
  } else {
    console.log("No continous free space found")
  }
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


function findFirstNRepetitions(arr, n, x) {
    for (let i = 0; i <= arr.length - n; i++) {
        let count = 0;
        
        for (let j = 0; j < n; j++) {
            if (arr[i + j] === x) {
                count++;
            } else {
                break;
            }
        }
        
        if (count >= n) {
            return i;
        }

        i=i+count;
    }
    
    return -1;
}
