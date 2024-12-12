const input = require('fs').readFileSync(0).toString().trim(); 

// yeah, it's ugly
// but hey, it works

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
let sum2=0;
for (const reg of regions) {
  sum+=reg.perimeter*reg.size;
  sum2+=reg.fences*reg.size;
  console.log("Region",reg.letter,"price",reg.fences*reg.size);
  console.log(reg.cells);
}
console.log(sum,sum2);


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

  function countSequences(arr) {
    //console.log("csx", arr);
    if (arr.length === 0) return 0;
    if (arr.length === 1) return 1;
    
    let sequences = 1;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1] + 1) {
            sequences++;
        }
    }
    
    return sequences;
  }

  function pairInList(y,x,list){
    for (el of list)
      if (el[0]==y && el[1]==x) return true;
    return false;
  }

  function calculateFences(letter, region) {
    let sum=0;

    // horizontal fences
    for (let y=0; y<map_height; y++) {
      let subtotal=0;

      let cells_top=[];
      let cells_bottom=[];

      for (let x=0; x<map_width; x++) {
        if (map[y][x]==letter && pairInList(y,x, region)) {
          if (y==0 || (map[y-1][x]!=letter)) 
            cells_top.push(x);
          if (y==map_height-1 || (map[y+1][x]!=letter))
            cells_bottom.push(x);
        };
      };
      // w cells mamy liste komorek z rośliną, np. [1,2,3,8,12,13]
      sum+=countSequences(cells_top);
      sum+=countSequences(cells_bottom);
      //console.log("TOP",cells_top, countSequences(cells_top));
      //console.log('BOTTOM',cells_bottom, countSequences(cells_bottom));

    }


    // vertical fences
    // we could just rotate the list by 90 degrees, but the lists would need to be deepcopied
    // and it's late already ;]
    for (let x=0; x<map_width; x++) {
      let subtotal=0;

      let cells_left=[];
      let cells_right=[];

      for (let y=0; y<map_height; y++) {
        if (map[y][x]==letter && pairInList(y,x, region)) {
          if (x==0 || (map[y][x-1]!=letter)) 
            cells_left.push(y);
          if (x==map_width-1 || (map[y][x+1]!=letter))
            cells_right.push(y);
        };
      };
      // w cells mamy liste komorek z rośliną, np. [1,2,3,8,12,13]
      sum+=countSequences(cells_left);
      sum+=countSequences(cells_right);
      //console.log(cells_left, cells_right);
    }


    return sum;
  }
  
  // Iterate through all cells
  for (let y = 0; y < map_height; y++) {
    for (let x = 0; x < map_width; x++) {
      if (!visited[y][x]) {
        const currentRegion = [];
        const perimeter = dfs(y, x, map[y][x], currentRegion);
        console.log("cr", currentRegion)
        console.log("fences", calculateFences(map[y][x], currentRegion));

        regions.push({
          letter: map[y][x],
          cells: currentRegion,
          size: currentRegion.length,
          fences: calculateFences(map[y][x], currentRegion),
          perimeter: perimeter
        });
      }
    }
  }
  
  return regions;
}

