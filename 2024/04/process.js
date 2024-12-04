const input = require('fs').readFileSync(0).toString().trim(); 

/* // 10, for example_input
let horizontal=[
              ...input.match(/(?=XMAS)/gms), 
              ...input.match(/(?=SAMX)/gms)
              ];
let vertical=[...input.match(/(?=X.{10}M.{10}A.{10}S)/gms),
              ...input.match(/(?=S.{10}A.{10}M.{10}X)/gms)]
let diagonal=[
              ...input.match(/(?=X.{11}M.{11}A.{11}S)/gms),
              ...input.match(/(?=S.{11}A.{11}M.{11}X)/gms),
              ...(input.match(/(?=X.{9}M.{9}A.{9}S)/gms) || []),
              ...(input.match(/(?=S.{9}A.{9}M.{9}X)/gms) || [])
              ]
*/
// 140, for input
let horizontal=[
              ...input.match(/(?=XMAS)/gms), 
              ...input.match(/(?=SAMX)/gms)
              ];
let vertical=[...input.match(/(?=X.{140}M.{140}A.{140}S)/gms),
              ...input.match(/(?=S.{140}A.{140}M.{140}X)/gms)]
let diagonal=[
              ...input.match(/(?=X.{141}M.{141}A.{141}S)/gms),
              ...input.match(/(?=S.{141}A.{141}M.{141}X)/gms),
              ...(input.match(/(?=X.{139}M.{139}A.{139}S)/gms) || []),
              ...(input.match(/(?=S.{139}A.{139}M.{139}X)/gms) || [])
              ]

console.log('horizontal matches: ', horizontal.length);
console.log('vertical matches: ', vertical.length);
console.log('diagonal matches: ', diagonal.length);
let total_matches=horizontal.length+vertical.length+diagonal.length;

console.log('total matches: ', total_matches);

