const fs = require('fs');

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


let grfr={}; // gates resposible for registers
// validation
for (const g of gates) {
  if (g.o.startsWith('z')) {
    //console.log(regname);
    grfr[g.o]=getAffectingGates(g.o, gates);
    console.log(g.o,"is affected by",grfr[g.o].size,"gates");
    let str="digraph logic_gates { rankdir=LR; node [shape=circle]; ";
    for (const gidx of grfr[g.o]) {
      console.log(gates[gidx]);
      const e=gates[gidx];
      str+=`{${e.i1},${e.i2}} -> ${e.o} [label=${e.op}]\n`;

    };
    str+='}';
    fs.writeFileSync(`graphs/${g.o}.dot`, str, 'utf8');
  };
};

// manual mutations
let p2;
p2=[ 53, 152 ] // z15, fph
switchOutputs( gates[p2[0]], gates[p2[1]]);
p2=[ 85, 17 ] // z21, gds
switchOutputs( gates[p2[0]], gates[p2[1]]);
p2=[ 153, 192 ] // z34, cqk
switchOutputs( gates[p2[0]], gates[p2[1]]);
p2=[ 67, 48 ] // z30, hpt
switchOutputs( gates[p2[0]], gates[p2[1]]);
// cqk,fph,gds,hpt,z15,z21,z30,z34

for (let i=0;i<gates.length;i++) {
  const g=gates[i];
  if (g.o=='z30' || g.o=='hpt' || g.o=='dwm') {
    console.log(i, g);
  };
};


let answer='';
let swaps=[];
for (const i of [53, 152, 85, 17, 153,192, 67, 48]) {
  console.log(i);
  swaps.push(gates[i].o);
};
swaps.sort();
console.log("answer:", swaps.join(","));

//
//

var lsb=Infinity;

let r={...registers};

simulateGates(gates, r);

let Rx=getBitValue(registers, 'x');
let Ry=getBitValue(registers, 'y');
let Rd=BigInt(getBitValue(r, 'z'));
// ideal value
Id=BigInt(Rx+Ry);
Ib=Id.toString(2);
console.log('I',Ib.padStart(46,'0'), Id)

// badbits
let Bd=(Rd^Id)
let Bb=Bd.toString(2);
const bits=findSetBits(Bd);
console.log('B',Bb.padStart(46,'0'), Bd, bits.length, bits.join(','))
process.exit(0);
const affectingGates=[];
for (const bit of findSetBits(Bd)) {
  const regname='z'+bit.toString().padStart(2,'0');

  //console.log(regname);
  grfr[regname]=getAffectingGates(regname, gates);
  console.log(regname,"is affected by",grfr[regname].size,"gates");
  affectingGates.push(grfr[regname]);
};

const gatesToMutate = [...affectingGates[0]].filter(num => 
    affectingGates.every(set => set.has(num))
);


let pairs=generateCombinations([...gatesToMutate], 2);
console.log('Pairs to mutate', pairs.length);

/// let's start mutating ONE by one
process.exit(0);
let i=0;
let ll=lsb;
for (const p of pairs) {
  const lastlsb=ll;
  console.log("Mutating pair",p);
  let g=structuredClone(gates);
  switchOutputs(g[p[0]], g[p[1]]);
  let r={...registers};

  simulateGates(g, r);

  let Rx=getBitValue(registers, 'x');
  let Ry=getBitValue(registers, 'y');
  let Rd=getBitValue(r, 'z');
  // ideal value
  Id=BigInt(Rx+Ry);
  Ib=Id.toString(2);
  console.log('I',Ib.padStart(46,'0'), Id)

  // badbits
  let Bd=Rd-Id
  let Bb=Bd.toString(2);
  const bits=findSetBits(Bd);
  console.log('B',Bb.padStart(46,'0'), Bd, p, bits.join(','))
  i++;
  if (lsb>lastlsb) process.exit(0);
};



/*
lsb=(Bd & -Bd)
console.log('L',lsb.toString(2).padStart(46,'0'), lsb)


if (lsb>0) {
  let bitpos=Math.log2(lsb & -lsb);
  badregister='z'+ bitpos.toString().padStart(2,'0');
  console.log('bad register at', badregister, '=', r[badregister]);

  const gatestocheck=getAffectingGates(badregister, gates);
    for (let c of gatestocheck)
      gatesToMutate.add(c);
};
*/

process.exit(0);

// attempt mutations
console.log('gatesToMutate', gatesToMutate.size);
//let pairs=generateCombinations([...gatesToMutate], 2);
console.log(pairs.length);
function switchOutputs(g1, g2) {
  [g1.o, g2.o] = [g2.o, g1.o]
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

function generateCombinations(arr, k) {
  const result = [];
  
  function combine(start, combo) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  }
  
  combine(0, []);
  return result;
}
function findSetBits(n) {
  const positions = [];
  let position = 0;

  while (n > BigInt(0)) {
    // If least significant bit is 1, add its position
    if (n & BigInt(1)) {
      positions.push(position);
    }
    // Right shift to check next bit
    n >>= BigInt(1);
    position++;
  }
  
  return positions;
}

