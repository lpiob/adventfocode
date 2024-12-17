const input = require('fs').readFileSync(0).toString().trim(); 

let regA=Number(input.match(/^Register A: (\d+)/)[1]);  // should those be in tertiary?
let regB=Number(input.match(/^Register B: (\d+)/m)[1]);
let regC=Number(input.match(/^Register C: (\d+)/m)[1]);

const program=input.match(/^Program: ([\d,]+)/m)[1].split(",").map(Number);

console.log(regA, regB, regC);
console.log(program);

const instructions=[
  'adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv'
]

let outputs=[];

for (let cursor=0; cursor<program.length;) {
  console.log("Reading opcode at", cursor);
  console.log(` ${instructions[program[cursor]]} ${program[cursor+1]} [A ${regA} B ${regB} C ${regC}]`);

  if (instructions[program[cursor]]=='adv') {               // 0
    let result=Math.floor(regA / ( 2^combo(program[cursor+1]) ))
    regA=result;
    cursor+=2;
  } else if (instructions[program[cursor]]=='bxl') {        // 1
    // @TODO
    console.log('UNKNOWN INSTRUCTION');
    cursor+=2;
  } else if (instructions[program[cursor]]=='bst') {        // 2
    console.log('UNKNOWN INSTRUCTION');
    cursor+=2;
  } else if (instructions[program[cursor]]=='jnz') {        // 3
    if (regA>0) {
      cursor=program[cursor+1]; // literal operand
    } else {
      cursor+=2;
    };
  } else if (instructions[program[cursor]]=='bxc') {        // 4
    console.log('UNKNOWN INSTRUCTION');
    cursor+=2;
  } else if (instructions[program[cursor]]=='out') {        // 5
    let val=combo(program[cursor+1]);
    outputs.push(val);
    //console.log(val);
    cursor+=2;
  } else if (instructions[program[cursor]]=='bdv') {
    console.log('UNKNOWN INSTRUCTION');
    cursor+=2;
  } else if (instructions[program[cursor]]=='cdv') {
    console.log('UNKNOWN INSTRUCTION');
    cursor+=2;
  } else {
    throw new error('undefined instruction encountered');
  };
};

console.log('program output', outputs.join(','));

function combo(operand) {
  // Combo operands 0 through 3 represent literal values 0 through 3.
  if (operand<=3) return operand;
  if (operand==4) return regA;
  if (operand==5) return regB;
  if (operand==6) return regC;
  if (operand==7) throw new Error('encountered a reserved combo operand');
  throw new Error("encountered unknown combo operand");

};
