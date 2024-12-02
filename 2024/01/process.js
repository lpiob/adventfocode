const input = require('fs').readFileSync(0).toString();
const lines = input.trim().split('\n');

let list1=[];
let list2=[];

// reading input
for (const line of lines) {
    const [num1, num2] = line.trim().split(/\s+/).map(Number);
    list1.push(num1);
    list2.push(num2);
}
// sorting
list1.sort(); // does not need numeric sort, as all numbers have 5 digits
list2.sort();

let total_distance=0;

for (let i=0; i<list1.length; i++) {
  const distance=Math.abs(list2[i]-list1[i]);
  //console.log(list1[i], list2[i], distance);
  total_distance+=distance;
}

console.log("Total distance: ", total_distance);

// Calculate a total similarity score by adding up each number 
// in the left list after multiplying it by the number of times 
// that number appears in the right list.

let list2uc={}

for (let i=0; i<list2.length; i++) { // we could do with foreach, but let's be consistent
  const el=list2[i];
  list2uc[el]=(list2uc[el] || 0) + 1;
}

let total_similarity=0;


for (let i=0; i<list1.length; i++) {
  total_similarity+=list1[i]*(list2uc[list1[i]] || 0);
}

console.log("Total similarity: ", total_similarity);
