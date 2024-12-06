const input = require('fs').readFileSync(0).toString().trim(); 

let maze_obstacles=[];
let maze_visited=[];
let maze_visited_dir=[]; // cells visited WHILE facing a direction
for (const dir of [0,2,4,6]) maze_visited_dir[dir]=[];

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
    for (const dir of [0,2,4,6])
      if (!maze_visited_dir[dir][row])
        maze_visited_dir[dir][row]=[];

    maze_obstacles[row][column] = cell
    maze_visited[row][column] = cell=="^" ? 1 : 0;
    maze_visited_dir[guard_direction][row][column] = cell=="^" ? 1 : 0;
    column+=1;
  }
  row+=1;
}


console.log("Guard is at", y, x);

let gsy=y; // guard start y,x
let gsx=x;

let maze_width=maze_obstacles[0].length;
let maze_height=maze_obstacles.length;

console.log("Maze is ", maze_obstacles[0].length, "x", maze_obstacles[0].length);

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
    throw new Error("oob");
  } else if (maze_visited_dir[guard_direction][ny][nx]>0) {
    console.log("Guard has revisited his previous position");
    console.log("He is stuck in a time loop");
    throw new Error("timeloop");
  } else if (maze_obstacles[ny][nx]=="#") {
    console.log("Obstacle ahead. NOT making a move, but turning right");
    guard_direction=(guard_direction+2)%8
    maze_visited_dir[guard_direction][y][x]+=1;   
    return makeamove();
  } else { // no obstacles, let's just make another
    console.log("Deciding to make another move");
    y=ny
    x=nx
    maze_visited[y][x]+=1;
    maze_visited_dir[guard_direction][y][x]+=1;

    return makeamove();
  }
}

// 1st pass - validate the maze is passable
// no error handling on purpose
makeamove();

// 2nd pass - introduce an obstacle and check if it cause a timeloop
maze_obstacles[6][3]="#";
// reset guard position
x=gsx
y=gsy

try {
  makeamove();
} catch (error) {
  console.log(error.message);
}
