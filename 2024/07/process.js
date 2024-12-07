const input = require('fs').readFileSync(0).toString().trim(); 
let step1_sum=0;

for (let line of input.split('\n')) {
  //line=line.replace(":","")
  let numbers=line.split(/:? /).map(Number);
  const result=numbers.shift()
  if (equationIsPossible([...numbers], result)) { // `[... ]` to pass a copy
    console.log("yay");
    step1_sum+=result;
  }
}
console.log("result for step1: ", step1_sum);

function equationIsPossible(numbers, result) {
  console.log("Checking if I can make",result,"from",numbers);

  // list to store possible variations in rpn format
  let variations=[]; 

  const possible_insertions=numbers.length-1;
  const operators=['+', '*']
  const totalVariations = Math.pow(operators.length, possible_insertions);

  for (let i=0; i < totalVariations; i++) {
    let variation=[];
    let ni=0;
    let oc=0;
    while (ni < numbers.length) {
      variation.push(numbers[ni]);
      if (ni>0) { //(ni+1)%2==0 || ni+1==numbers.length) {
        variation.push(operators[(Math.floor(i / Math.pow(2, oc)) % 2)]);
        oc++;
      };
      ni++;
    }
    

    variations.push(variation);

    // actually, we can check it right here
    let evres=evaluateRPN(variation);
    if (evres==result) { 
      return true;
    }

  }


  return false;
}

function evaluateRPN(tokens) {
    const stack = [];
    
    for (const token of tokens) {
        if (!isNaN(token)) {
            stack.push(Number(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
                default:
                    throw new Error(`Unknown operator: ${token}`);
            }
        }
    }
    
    return stack[0];
}
