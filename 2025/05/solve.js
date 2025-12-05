const input = require('fs').readFileSync(0).toString().trim(); 
let p1=0;
let p2=0;
const [freshlist, availablelist]=input.split("\n\n");
const available_products = availablelist.split("\n").map(Number);
const fresh_ranges=[];

const fresh_products = {};
for (const line of freshlist.split("\n")) {
  const [from,to]=line.split("-").map(Number);
  fresh_ranges.push({from,to});
}
/*
console.log('Fresh list:', freshlist);
console.log('Fresh ranges:', fresh_ranges);
console.log('Available products:', available_products);
*/

for (const product of available_products) {
  for (const range of fresh_ranges) {
    if (product>=range.from && product<=range.to) {
      p1++;
      break;
    }
  }
}

console.log("Part 1:", p1);

// Part 2
// merge overlapping ranges

const merged_ranges = [];
fresh_ranges.sort((a,b)=>a.from-b.from);
for (const range of fresh_ranges) {
  if (merged_ranges.length===0) {
    merged_ranges.push(range);
  } else {
    const last_range = merged_ranges[merged_ranges.length-1];
    if (range.from <= last_range.to+1) {
      // overlap
      last_range.to = Math.max(last_range.to, range.to);
    } else {
      merged_ranges.push(range);
    }
  }
}

for (const range of merged_ranges) {
  var diff=range.to-range.from+1;
  p2+=diff;
}

console.log("Part 2:", p2);
