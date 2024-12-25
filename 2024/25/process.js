const input = require('fs').readFileSync(0).toString().trim(); 

let locks=[];
let keys=[];

for (let diagram of input.split("\n\n")){
 if (diagram.startsWith('#')) {
   cols=[];
   for (let i=0;i<5;i++) {
     let col=diagram.match(/^(.).{5}(.).{5}(.).{5}(.).{5}(.).{5}(.).{5}(.)/ms).slice(1).join("")
     diagram=diagram.slice(1);
     //console.log("col", i, col, col.indexOf('.')-1);
     cols.push(col.indexOf('.')-1);
    };
   locks.push(cols);
 } else {
   cols=[];
   for (let i=0;i<5;i++) {
     let col=diagram.match(/^(.).{5}(.).{5}(.).{5}(.).{5}(.).{5}(.).{5}(.)/ms).slice(1).join("")
     diagram=diagram.slice(1);
     //console.log("col", i, col, 6-col.indexOf('#'));
     cols.push(6-col.indexOf('#'));
    };
    keys.push(cols);
 };
};

console.log(locks.length, keys.length);

let sum=0;
for (const key of keys) {
  for (const lock of locks) {
    if (fit(key,lock)) sum++;
  };
};

console.log("sum", sum);


function fit(key,lock) {
 for (let i=0; i<5; i++) {
   if (key[i]+lock[i]>5) return false;
 };
 return true;
};
