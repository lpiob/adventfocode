const input = require('fs').readFileSync(0).toString().trim(); 

for (const line of input.split("\n")) {
  console.log("input:",line);
  let output='';
  for (let i=0;i<line.length;i++) {
    const subline=line.slice(i);
    const m=subline.match(/(.*?)\((\d+)x(\d+)\)(.*)$/)
    if (m) {
      // prefix
      output+=m[1];
      i+=m[1].length;

      //console.log('subline:', subline);
      //console.log(m);

      let chars=m[4].slice(0, Number(m[2]));
      output+=chars.repeat(m[3]);
      i+=2+m[2].length+m[3].length+Number(m[2]);
    } else {
      output+=subline;
      i=line.length;
    };
    
  };
  console.log("output:",output);
  console.log("");
  console.log("output length", output.length);
};
