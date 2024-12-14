const input = require('fs').readFileSync(0).toString().trim(); 

const entries=input.split("\n").map(Number);

for (let i=0;i<entries.length-1;i++) {
  for (let j=i+1; j<entries.length; j++) {
    for (let k=j+1; k<entries.length; k++) {
      //console.log(entries[i], entries[j]);
      if (entries[i]+entries[j]+entries[k]==2020) {
        console.log(entries[i]*entries[j]*entries[k]);
      };
    }
  }
}

console.log(entries);

