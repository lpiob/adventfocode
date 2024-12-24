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

function simulateGates(gates, registers) {
  gates=[...gates]
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
  return registers;
};

let lsb=Infinity;
let gatesToMutate=new Set();
let i=0;
while (lsb>0) {
//for (let i=0;i<4;i++) {
  console.log('sim',i, 'mutations', gatesToMutate.size);
  let g=[...gates];
  let r={...registers};

  simulateGates(g, r);

  let Rx=getBitValue(registers, 'x');
  let Ry=getBitValue(registers, 'y');
  let Rd=getBitValue(r, 'z');
  // ideal value
  Id=Rx+Ry;
  Ib=Id.toString(2);
  console.log('I',Ib.padStart(46,'0'), Id)

  // badbits
  let Bd=Id-Rd
  let Bb=Bd.toString(2);
  console.log('B',Bb.padStart(46,'0'), Bd)
  let lsb=(Bd & -Bd)
  console.log('L',lsb.toString(2).padStart(46,'0'), lsb)


  if (lsb>0) {
    let bitpos=Math.log2(lsb & -lsb);
    badregister='z'+ bitpos.toString().padStart(2,'0');
    console.log('bad register at', badregister, '=', r[badregister]);

    if (i==0) {
      const gatestocheck=getAffectingGates(badregister, g);

      for (let c of gatestocheck)
        gatesToMutate.add(c);
    }
  };
  i++;
  if (i>5) process.exit(0);
};


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

function getAffectingGates(reg, gates){
  let susgate=new Set();
  let susreg=new Set([reg]);

  let lastsetsize=Infinity;
  let i=0;
  while (lastsetsize!=susgate.size) {
    lastsetsize=susgate.size;
    for (let i=gates.length-1; i>=0; i--) {
      const g=gates[i];
      if (susreg.has(g.o)) {
        susreg.add(g.i1);
        susreg.add(g.i2);
        susgate.add(i);
      };
    };
  };
  return susgate;
};
