const input = require('fs').readFileSync(0).toString().trim(); 

// M.S
// .A.
// M.S
//
// S.S
// .A.
// M.M
//
// S.M
// .A.
// S.M
//
// M.M
// .A.
// S.S

// 10, for example_input
/*
let diagonal=[
              ...(input.match(/(?=M.S.{9}A.{9}M.S)/gms) || []),
              ...(input.match(/(?=S.S.{9}A.{9}M.M)/gms) || []),
              ...(input.match(/(?=S.M.{9}A.{9}S.M)/gms) || []),
              ...(input.match(/(?=M.M.{9}A.{9}S.S)/gms) || []),
              ]
*/

// 140, for user input
 
let diagonal=[
              ...(input.match(/(?=M.S.{139}A.{139}M.S)/gms) || []),
              ...(input.match(/(?=S.S.{139}A.{139}M.M)/gms) || []),
              ...(input.match(/(?=S.M.{139}A.{139}S.M)/gms) || []),
              ...(input.match(/(?=M.M.{139}A.{139}S.S)/gms) || []),
              ]
 

console.log('diagonal matches: ', diagonal.length);

