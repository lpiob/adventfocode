const input = require('fs').readFileSync(0).toString().trim(); 

const width=Number(process.argv[2]);
const height=Number(process.argv[3]);
const reps=Number(process.argv[4]);

if (!width || !height ) {
  console.log(`Use ${process.argv[0]} ${process.argv[1]} <width> <height> <reps> < input`);
  process.exit(1);
};

console.log("width", width, "height", height, "reps", reps);


let robots=[];

for (const el of input.split('\n')) {
  const matches=el.match(/^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
  /*
   * Each robot's position is given as p=x,y where x represents the 
   * number of tiles the robot is from the left wall and y represents 
   * the number of tiles from the top wall
   */
  matches.shift();
  const robot={
    p: [Number(matches.shift()), Number(matches.shift())],
    v: [Number(matches.shift()), Number(matches.shift())],
  }
  //if (robot.p[0]==2 && robot.p[1]==4) {
  if (true) {
  // modulo with negative wrapping
  // ((position + steps) % width + width) % width;

  robot.pN=[
      ((robot.p[0] + reps*robot.v[0]) % width + width ) % width,
      ((robot.p[1] + reps*robot.v[1]) % height + height ) % height,
  ];

  robots.push(robot);

  };

}


let qc=[0,0,0,0];

let qc2=0;

for (const r of robots) {
  if      (r.pN[0]<(width-1)/2 && r.pN[1]<(height-1)/2) qc[0]++;
  else if (r.pN[0]>(width-1)/2 && r.pN[1]<(height-1)/2) qc[1]++;
  else if (r.pN[0]>(width-1)/2 && r.pN[1]>(height-1)/2) qc[2]++;
  else if (r.pN[0]<(width-1)/2 && r.pN[1]>(height-1)/2) qc[3]++;

  //if (r.pN[0]<(width-1)/8 && r.pN[1]<(height-1)/8) qc2++;
}


let safety_factor = qc[0] * qc[1] * qc[2] * qc[3];
console.log(qc, safety_factor, qc2);

// render
//
//
if (qc2==0) 
for (let y=0; y<height; y++) {
  let line="";
  for (let x=0; x<width; x++) {
    let cell=0;
    for (const r of robots) {
      if (r.pN[0]==x && r.pN[1]==y) {
        cell++;
      }
    }
    if (cell==0) line=line+".";
    else line=line+cell;
  };
  console.log(line);
};
