const input = require('fs').readFileSync(0).toString().trim(); 
const lines=input.split("\n");

let p1=0;
let p2=0;

const maze=[];

for (const line of lines) {
  maze.push(line.split(''));
};
console.log(maze);

function countNeighbors(maze, y, x, char) {
  let count=0;
  for (let dy=-1;dy<=1;dy++)
    for (let dx=-1;dx<=1;dx++)
    {
      if (dy==0 && dx==0) continue;
      //console.log(`Checking (${x+dx},${y+dy})`,'value is', maze[y+dy] ? maze[y+dy][x+dx] : 'undefined');
      if (maze[y+dy]) {
        if (maze[y+dy][x+dx]===char) count++;
      }
    }
  console.log(`Total neighbors for (${x},${y}) is ${count}`);
  return count;
}

const mazecopy=JSON.parse(JSON.stringify(maze));


console.log(countNeighbors(maze, 1, 2, '@'));
for (let y=0;y<maze.length;y++) {
  for (let x=0;x<maze[y].length;x++) {
    if (maze[y][x]=='@' && countNeighbors(maze, y, x, '@')<4) {
      p1++;
      mazecopy[y][x]='x';
    }
  }
}
console.log(mazecopy);

console.log("Part 1:", p1);
console.log("Part 2:", p2);
