const input = require('fs').readFileSync(0).toString().trim(); 

let map=[]; // 2d map
let plants=[];

let x=0;
let y=0;

for (let row of input.split('\n')) {
  map[y]=[];
  for (let cell of row) {
    map[y][x]=cell;
    x++;
    plants[cell]=(plants[cell]||0)+1;
  }
  y++; x=0;
}

const map_height=map.length;
const map_width=map[0].length;
console.log(map);
console.log(plants);

// identify regions
let regions=findRegions(map);
console.log(regions);
let sum=0;
for (const reg of regions) {
  sum+=reg.perimeter*reg.size;
}
console.log(sum);


function findRegions(map) {
  const map_height = map.length;
  const map_width = map[0].length;
  const visited = Array(map_height).fill().map(() => Array(map_width).fill(false));
  const regions = [];
  
  // Direction array for adjacent cells (up, right, down, left)
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  function calculateCellPerimeter(y, x, letter) {
    let perimeter = 0;
    
    for (const [dx, dy] of directions) {
      const newRow = y + dx;
      const newCol = x + dy;
      
      if (newRow < 0 || newRow >= map_height || 
          newCol < 0 || newCol >= map_width ||
          map[newRow][newCol] !== letter) {
        perimeter++;
      }
    }
    
    return perimeter;
  }
  
  function dfs(y, x, letter, currentRegion) {
    if (y < 0 || y >= map_height || x < 0 || x >= map_width || 
        visited[y][x] || map[y][x] !== letter) {
      return 0;
    }
    
    visited[y][x] = true;
    currentRegion.push([y, x]);
    
    let perimeter = calculateCellPerimeter(y, x, letter);
 
    // szukamy w okolicy
    for (const [dx, dy] of directions) {
      perimeter=perimeter+dfs(y + dx, x + dy, letter, currentRegion);
    }
    
    return perimeter;
  }
  
  // Iterate through all cells
  for (let y = 0; y < map_height; y++) {
    for (let x = 0; x < map_width; x++) {
      if (!visited[y][x]) {
        const currentRegion = [];
        const perimeter = dfs(y, x, map[y][x], currentRegion);
        regions.push({
          letter: map[y][x],
          cells: currentRegion,
          size: currentRegion.length,
          perimeter: perimeter
        });
      }
    }
  }
  
  return regions;
}
