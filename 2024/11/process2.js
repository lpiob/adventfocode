const input = require('fs').readFileSync(0).toString().trim(); 

let stones=[];
let stones_map={};
for (el of input.split(" ")) {
  stones.push(Number(el));
  stones_map[Number(el)] = ( stones_map[Number(el)] || 0 ) + 1;
}

console.log("input",stones_map);

for (let i=1;i<=75; i++) {
  console.log("blink no ", i, ":")
  stones_map=blink(stones_map);
  //console.log(stones_map);
  let sum=0;
  for (const key in stones_map)
    sum+=stones_map[key];
  console.log("total stones", sum);
}


function blink(stones_map) {
  let new_stones_map={}
  for (const key in stones_map) {
      const engraving=String(key)
      const length=Number(engraving.length);
      if (key==0) {
        // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
        //console.log("Convert 0 -> 1 x ", stones_map[key]);
        //console.log("new_stones_map[1]",new_stones_map[1]);
        new_stones_map[1]=stones_map[0];
        //console.log("new_stones_map[1]",new_stones_map[1]);

      } else if (length%2==0) {
        // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
        //console.log("splitting",key,"to",Number(engraving.slice(-length/2)),"and",Number(engraving.slice(0, length/2)));
        new_stones_map[Number(engraving.slice(-length/2))] = 
          ( stones_map[key] || 0) + 
          ( new_stones_map[Number(engraving.slice(-length/2))] || 0);
        new_stones_map[ Number(engraving.slice(0, length/2)) ] = 
          ( stones_map [ key ] || 0) + 
          ( new_stones_map [ Number(engraving.slice(0, length/2))  ] || 0);
      } else {
        //console.log("converting", key, "to", key*2024);
        new_stones_map [ key*2024 ] = ( stones_map [ key ] || 0 ) + (new_stones_map [ key*2024 ] || 0 );
        //delete(new_stones_map [ key]);
      }

  }
  return new_stones_map;
}
