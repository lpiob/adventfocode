const input = require('fs').readFileSync(0).toString().trim(); 

let total_tokens=0;

let count=0;
for (const el of input.split('\n\n')) {
  
  const a_matches=el.match(/A: X\+(\d+), Y\+(\d+)/);
  let [A0,A1]=[Number(a_matches.pop()), Number(a_matches.pop())]; // switching order, y first
  
  const b_matches=el.match(/B: X\+(\d+), Y\+(\d+)/);
  let [B0, B1]=[Number(b_matches.pop()), Number(b_matches.pop())]; // switching order, y first

  const p_matches=el.match(/Prize: X=(\d+), Y=(\d+)/);
  let [P0, P1]=[Number(p_matches.pop()), Number(p_matches.pop())];

  P0+=10000000000000;
  P1+=10000000000000;

/*
  a * A1 + b * B1 = prize1
  a * A2 + b * B2 = prize2
  a<=100 b<=100

  console.log(`${A0}*a + ${B0}*b = ${P0}`)
  console.log(`${A1}*a + ${B1}*b = ${P1}`)
*/

  const tmpB0=B0;

  A0=A0*B1
  B0=B0*B1
  P0=P0*B1

  A1=A1*tmpB0
  B1=B1*tmpB0
  P1=P1*tmpB0
  /*
  console.log(`=>`);
  console.log(`${A0}*a + ${B0}*b = ${P0}`)
  console.log(`${A1}*a + ${B1}*b = ${P1}`)
  console.log(`=>`);
  */
  const a = (P0-P1)/(A0-A1);
  const b = (P1 - A1*a)/B1;
  /*
  console.log(`=>`);
  console.log(`a = ${a}`);
  console.log(`b = ${b}`);
  console.log(`---`);
  */
  if (Number.isInteger(a) && Number.isInteger(b)) {
//    console.log("a+b=",a+b);
    const cost=a*3+b;
//    console.log("cost=",cost);
    total_tokens+=cost;
  }
}

console.log("total", total_tokens);

