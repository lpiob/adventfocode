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
  //console.log("Reading opcode at", cursor);
  console.log(` ${instructions[program[cursor]]} ${program[cursor+1]} [A ${regA} B ${regB} C ${regC}]`);

  if (instructions[program[cursor]]=='adv') {               // 0
    regA = regA >> combo(program[cursor+1])
    cursor+=2;
  } else if (instructions[program[cursor]]=='bxl') {        // 1
    regB = regB ^ program[cursor+1];
    cursor+=2;
  } else if (instructions[program[cursor]]=='bst') {        // 2
    regB = combo(program[cursor+1]) % 8;
    cursor+=2;
  } else if (instructions[program[cursor]]=='jnz') {        // 3
    if (regA>0) {
      cursor=program[cursor+1]; // literal operand
    } else {
      cursor+=2;
    };
  } else if (instructions[program[cursor]]=='bxc') {        // 4
    regB = regB ^ regC
    cursor+=2;
  } else if (instructions[program[cursor]]=='out') {        // 5
    let val=combo(program[cursor+1])%8;
    outputs.push(val);
    //console.log(val);
    cursor+=2;
  } else if (instructions[program[cursor]]=='bdv') {
    throw new error('UNKNOWN INSTRUCTION');
    cursor+=2;
  } else if (instructions[program[cursor]]=='cdv') {
    /* The cdv instruction (opcode 7) works exactly like the adv 
     * instruction except that the result is stored in the C 
     * register. (The numerator is still read from the A register.)
     */
    regC = regA >> combo(program[cursor+1])
    cursor+=2;
  } else {
    throw new error('undefined instruction encountered');
  };
};
console.log(`Program HALTed with [A ${regA} B ${regB} C ${regC}]`);

console.log('Program output', outputs.join(','));

function combo(operand) {
  // Combo operands 0 through 3 represent literal values 0 through 3.
  if (operand<=3) return operand;
  if (operand==4) return regA;
  if (operand==5) return regB;
  if (operand==6) return regC;
  if (operand==7) throw new Error('encountered a reserved combo operand');
  throw new Error("encountered unknown combo operand");

};
