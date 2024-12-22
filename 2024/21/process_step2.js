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

let dirpadpositions=[];

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

// magic overrides for 'blank' place on keypad
keypad_distance["A-1"].keys="^<<";
keypad_distance["A-4"].keys="^^<<";
keypad_distance["A-7"].keys="^^^<<";
keypad_distance["2-9"].keys=">^^";

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

dirpad_distance['<-^'].keys=">^";
dirpad_distance['<-A'].keys=">>^";
dirpad_distance['<-v'].keys=">";
dirpad_distance['<->'].keys=">>";

dirpad_distance['v-<'].keys="<";
dirpad_distance['v->'].keys=">";
dirpad_distance['v-A'].keys=">^";
dirpad_distance['v-v'].keys="";

dirpad_distance['A-v'].keys="<v";
dirpad_distance['A-^'].keys="<";
dirpad_distance['A-<'].keys="v<<";
dirpad_distance['A->'].keys="v";

dirpad_distance['>-A'].keys="^";
dirpad_distance['>-^'].keys="<^";
dirpad_distance['>-v'].keys="<";
dirpad_distance['>-<'].keys="<<";

dirpad_distance['^->'].keys=">v";
dirpad_distance['^-A'].keys=">";
dirpad_distance['^-<'].keys="v<";
dirpad_distance['^-v'].keys="v";

//console.log(getDirpadCost('A', '<', 25));
//process.exit(0);

let sum2=0;
let sum25=0;
let finalkeyslen=0;

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
    //console.log(l, `${keypad_key}-${l}`, k_cost, k);
    if (k.keys) {
      keystack += k.keys
    } else {
      keystack += '<'.repeat(k.left);
      keystack += '^'.repeat(k.up);
      keystack += 'v'.repeat(k.down);
      keystack += '>'.repeat(k.right);
    };
    keystack += 'A';
    keypad_cost+=k_cost;
    keypad_key=l;
  };

  console.log('keystack', keystack);
  console.log('cost of keypad presses:', keypad_cost);

  for (let i=0; i<25;i++) {
    dirpadpositions[i]='A';
  };

  // convert keystack to dirstack
  let sum_cost=0;
  const n=2;
  for (const c of keystack) {
    console.log(c);
    let cost=getDirpadCost(dirpadpositions[n], c, n);
    sum_cost+=cost
  };
  let code_number=Number(code.replace(/^0*(\d+)A$/,'$1'));
  console.log(code,'=',sum_cost,'*',code_number);
  sum2+=sum_cost*code_number;
};

console.log('sum2', sum2);

let cache=new Map();

function getDirpadCost(from,to,n) {
  let cost=0;
  let keys='';
  let k=dirpad_distance[`${from}-${to}`];
  console.log(`${from}-${to}-${n}`);
  //

  if (k.keys && n>0) {
    keys+=k.keys;
    for (const c of k.keys) {
      //console.log("subcheck",c,n-1);
      const subcost=getDirpadCost(dirpadpositions[n-1], c, n-1);
      cost+=subcost;
    };
  } else if (from==to && n>0) {
    //keys+='A';
    //const subcost=getDirpadCost(dirpadpositions[n], 'A', n-1);
    //cost+=subcost;
  };

  if (n>0) {
    keys += 'A';
    const subcost=getDirpadCost(dirpadpositions[n-1], 'A', n-1);
    cost+=subcost;
  };
  

  //if (n==0)
  //console.log("k",n,keys);
  
  if (n==0) {
    //console.log('n0 keys to press', to, '=', keys);
    //console.log('local cost', k.dist+1);
    cost+=k.dist;
    dirpadpositions[n]=to;
    return cost;
  };
  dirpadpositions[n]=to;
  cost+=keys.length;
  return cost;

};

function getDirpadKeys(keystack) {
  console.log('analyzing for',keystack);
  let dirpad_cost=0;
  let dirpad_key='A';
  let dirstack={};
    for (const l in keystack) {
      const times=keystack[l];
      console.log('  checking key ',l, 'which was pressed',times,'times');

      let k=dirpad_distance[`${dirpad_key}-${l}`];
      let k_cost=k.dist;
      if (k_cost === undefined)
        throw new Error(`Distance for pad ${dirpad_key}-${l} unknown`);

      dirstack['<'] = times * ((dirstack['<']||0) + k.left)
      dirstack['^'] = times * ((dirstack['^']||0) + k.up);
      dirstack['v'] = times * ((dirstack['v']||0) + k.down);
      dirstack['>'] = times * ((dirstack['>']||0) + k.right);
      dirstack['A'] = times * ((dirstack['A']||0) + 1);
      dirpad_cost+=k_cost;
      dirpad_key=l;
    };
  console.log('returning', dirstack);
  return [dirstack, dirpad_cost];
};
