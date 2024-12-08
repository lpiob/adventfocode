const input = require('fs').readFileSync(0).toString().trim(); 

let antenna_map=[]; // 2d map
let antinode_map=[];
let antennas={}; // map of lists of antennas

let x=0;
let y=0;
for (let row of input.split('\n')) {
  antenna_map[y]=[];
  antinode_map[y]=[];
  for (let cell of row) {
    antenna_map[y][x]=cell;
    antinode_map[y][x]=".";
    if (cell!="." && cell!="#") {
      if (!antennas[cell]) antennas[cell]=[];
      antennas[cell].push([y,x]);
    }
    x++;
  }
  y++; x=0;
}

console.log(antennas);

for (const freq in antennas) {
  console.log("Calculating antinodes for", freq)
  let pairs=[];
  antennas[freq].forEach(a => {
    antennas[freq].forEach(b => {
      if (a!==b) { //  && !hasPair(pairs, [y, x]))
        // we include pairs on purpose
        pairs.push([a, b]);
        const dy=a[0]-b[0]
        const dx=a[1]-b[1]
        const ny=a[0]+dy;
        const nx=a[1]+dx;
        
        console.log("Antinode for ",a,"and",b ," at ", ny, "x", nx)

        antinode_map[ny][nx]="#"

      }
    });
  });  
  //console.log(pairs);
}


function hasPair(pairs, pair) { // because .includes/.indexOf does not work on lists
    for (let i = 0; i < pairs.length; i++) {
        if (JSON.stringify(pairs[i]) === JSON.stringify([pair[0], pair[1]])) {
            return true;
        }
    }
    return false;
}
