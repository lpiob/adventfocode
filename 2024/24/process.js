const input = require('fs').readFileSync(0).toString().trim(); 

const registers={};
let gates=[];

for (const line of input.split("\n\n")[0].split("\n")) {
  const [_, input, val] = line.match(/^(.+?): (\d)$/);
  registers[input]=Number(val);
};

for (const line of input.split("\n\n")[1].split("\n")) {
  const [_, i1, op, i2, o] = line.match(/^(.+?) (AND|OR|XOR) (.+?) -> (.+?)$/);
  gates.push({
    i1: i1,
    i2: i2,
    op: op,
    o: o
  });
  //console.log(i1, op, i2, o);
}

let last_length=Infinity;

while (gates.length>0 && last_length!=gates.length) {
  last_length=gates.length
  //console.log("gates to process", gates.length);
  //console.log("registers", registers);
  for (let i=gates.length-1;i>=0;i--) {
    const g=gates[i]
    if (registers[g.i1]>=0 && registers[g.i2]>=0) {
      //console.log('performing', g);
      if (g.op=='XOR') {
        registers[g.o]=registers[g.i1] ^ registers[g.i2];
      } else if (g.op=='AND') {
        registers[g.o]=registers[g.i1] && registers[g.i2]; // logical behaves the same for those registers
      } else if (g.op=='OR') {
        registers[g.o]=registers[g.i1] || registers[g.i2]; // logical behaves the same for those registers
      };
      gates.splice(i, 1);
    } else {
      //console.log('skipping', g, 'because', registers[g.i1]>=0, registers[g.i2]>=0);
    };
  };
};

x=getBitValue(registers, 'x');
y=getBitValue(registers, 'y');
getBitValue(registers, 'z');
// ideal value
Id=x+y;
Ib=Id.toString(2);
console.log('I',Ib.padStart(46,'0'), Id)


function getBitValue(registers, type) {
  let rn=Object.keys(registers).sort();
  let bits=[];
  for (let r of rn) {
    if (r.startsWith(type)) bits.push(registers[r]);
  };
  bits = bits.reverse();

  const decimal = parseInt(bits.join(''), 2);

  console.log(type, bits.join('').padStart(46,'0'), decimal);
  return decimal;
};
