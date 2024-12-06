const input = require('fs').readFileSync(0).toString().trim(); 

let maze_obstacles=[];
// i have a feeling that in step 2 we'll be counting visits on the same square
let maze_visited=[];

// guard position
let x=0;  // cartesian, like in maze[y][x]
let y=0;
let guard_direction=0; // 0 top 2 right 4 down 6 left

// parsing input
let row=0;
for (const line of input.split('\n')) {
  let column=0;
  for (let cell of line) {
    if (cell=="^") { // saving the guard position
      y=row;
      x=column;
      cell=".";
    }
    if (!maze_obstacles[row]) maze_obstacles[row]=[];
    if (!maze_visited[row]) maze_visited[row]=[];
    maze_obstacles[row][column] = cell
    maze_visited[row][column] = cell=="^" ? 1 : 0;
    column+=1;
  }
  row+=1;
}

console.log("Guard is at", y, x);

let maze_width=maze_obstacles[0].length;
let maze_height=maze_obstacles.length;

console.log("Maze is ", maze_obstacles[0].length, "x", maze_obstacles[0].length);
console.log(maze_obstacles);

function countdistinctvisitedpositions(maze) {
  let result=0;
  for (line of maze) {
    for (cell of line) {
      if (cell>0) result+=1;
    }
  }
  return result;
}

function calculatenewposition(y,x, guard_direction) {
  if (guard_direction==0) y=y-1;
  else if (guard_direction==2) x=x+1;
  else if (guard_direction==4) y=y+1;
  else if (guard_direction==6) x=x-1;
  return [y,x]
}

function makeamove(){
  console.log("We are at ", y, x, " direction: ", guard_direction);
  let [ny,nx]=calculatenewposition(y,x,guard_direction);
  console.log("New position would be ", ny, nx);
  if (ny<0 || ny>=maze_height || nx<0 || nx>=maze_width) {
    console.log("Guard will leave the maze");
    console.log("He has visited ", countdistinctvisitedpositions(maze_visited), "distinct cells");

    //console.log(maze_visited);
    return -1; // out of bounds
  } else if (maze_obstacles[ny][nx]=="#") {
    console.log("Obstacle ahead. NOT making a move, but turning right");
    guard_direction=(guard_direction+2)%8
    return makeamove();
  } else { // no obstacles, let's just make another
    console.log("Deciding to make another move");
    y=ny
    x=nx
    maze_visited[y][x]+=1;

    return makeamove();
  }
}


makeamove();
