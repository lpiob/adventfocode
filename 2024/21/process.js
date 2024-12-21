const input = require('fs').readFileSync(0).toString().trim(); 

const codes=input.split("\n");

const keypad=[
  [..."789"],
  [..."456"],
  [..."123"],
  [...".0A"]
];

const dirpad=[
  [..."X^A"],
  [..."<v>"]
];

let keypad_distance={};
for (let y1=0; y1<4; y1++) {
  for (let x1=0; x1<3; x1++) {
    const key1 = keypad[y1][x1];
    for (let y2=0; y2<4; y2++) {
      for (let x2=0; x2<3; x2++) {
        const key2=keypad[y2][x2];
        const dist=Math.abs(y2-y1)+Math.abs(x2-x1);
        //console.log("distance from",key1,"to",key2, '=', dist);
        
        const left_presses=(x1>x2 ? Math.abs(x2-x1) : 0);
        const right_presses=(x2>x1 ? Math.abs(x1-x2) : 0);
        const up_presses=(y1>y2 ? Math.abs(y2-y1) : 0);
        const down_presses=(y2>y1 ? Math.abs(y1-y2) : 0);

        keypad_distance[`${key1}-${key2}`]={
          dist: dist,
          up: up_presses,
          down: down_presses,
          left: left_presses,
          right: right_presses
        };
      }
    };
  };
};

let dirpad_distance={};
for (let y1=0; y1<2; y1++) {
  for (let x1=0; x1<3; x1++) {
    const key1 = dirpad[y1][x1];
    for (let y2=0; y2<2; y2++) {
      for (let x2=0; x2<3; x2++) {
        const key2=dirpad[y2][x2];
        const dist=Math.abs(y2-y1)+Math.abs(x2-x1);
        //console.log("distance from",key1,"to",key2, '=', dist);
        const left_presses=(x1>x2 ? Math.abs(x2-x1) : 0);
        const right_presses=(x2>x1 ? Math.abs(x1-x2) : 0);
        const up_presses=(y1>y2 ? Math.abs(y2-y1) : 0);
        const down_presses=(y2>y1 ? Math.abs(y1-y2) : 0);

        dirpad_distance[`${key1}-${key2}`]={
          dist: dist,
          up: up_presses,
          down: down_presses,
          left: left_presses,
          right: right_presses
        };

      }
    };

  };
};

let sum=0;

for (const code of codes) {
  console.log('About to type',code);
  let keypad_cost=0;
  let keypad_key='A';
  let keystack='';
  for (const l of [...code]) {
    let k=keypad_distance[`${keypad_key}-${l}`];
    let k_cost=k.dist;
    if (k_cost === undefined)
      throw new Error(`Distance for key ${keypad_key}-${l} unknown`);
    console.log(l, `${keypad_key}-${l}`, k_cost, k);
    keystack += '^'.repeat(k.up);
    keystack += '<'.repeat(k.left);
    keystack += '>'.repeat(k.right);
    keystack += 'v'.repeat(k.down);
    keystack += 'A';
    keypad_cost+=k_cost;
    keypad_key=l;
  };

  console.log('keystack', keystack);
  console.log('cost of keypad presses:', keypad_cost);

  // wiemy ile ruchów potrzeba aby się przesunąc na nowy klawisz
  // wiemy ile razy kazdy klawisz trzeba nacisnąć
  // czy mozemy to przetlumaczyc na ilosc nacisniec dirpad?
  // sprawdzamy po kolei

  let [dirstack, dirpad_cost]=getDirpadKeys(keystack);
  console.log('dirstack', dirstack);
  console.log('cost of dirpad presses', dirpad_cost);
  [dirstack, dirpad_cost]=getDirpadKeys(dirstack);
  console.log('dirstack', dirstack);
  console.log('cost of dirpad presses', dirpad_cost);

  let code_number=Number(code.replace(/^0*(\d+)A$/,'$1'));
  console.log(dirstack.length,code_number);
  sum+=dirstack.length*code_number;
};

console.log('sum', sum);

function getDirpadKeys(keystack) {
  let dirpad_cost=0;
  let dirpad_key='A';
  let dirstack='';
  for (const l of [...keystack]) {
    let k=dirpad_distance[`${dirpad_key}-${l}`];
    let k_cost=k.dist;
    if (k_cost === undefined)
      throw new Error(`Distance for pad ${dirpad_key}-${l} unknown`);
    //console.log(l, `${dirpad_key}-${l}`, k_cost, k);
    dirstack += '^'.repeat(k.up);
    dirstack += '<'.repeat(k.left);
    dirstack += '>'.repeat(k.right);
    dirstack += 'v'.repeat(k.down);
    dirstack += 'A';
    dirpad_cost+=k_cost;
    dirpad_key=l;
  };
  return [dirstack, dirpad_cost];
};
