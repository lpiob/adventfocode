/* be careful, there are spots of blood and sweat in this code */

const input = require('fs').readFileSync(0).toString().trim(); 

const codes=input.split("\n");
var cache=new Map();

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
dirpad_distance['v-A'].keys="^>";
dirpad_distance['v-v'].keys="";
dirpad_distance['v-^'].keys="^";

dirpad_distance['A-v'].keys="<v";
dirpad_distance['A-^'].keys="<";
dirpad_distance['A-<'].keys="v<<";
dirpad_distance['A->'].keys="v";

dirpad_distance['>-A'].keys="^";
dirpad_distance['>-^'].keys="<^";
dirpad_distance['>-v'].keys="<";
dirpad_distance['>-<'].keys="<<";

dirpad_distance['^->'].keys="v>";
dirpad_distance['^-A'].keys=">";
dirpad_distance['^-<'].keys="v<";
dirpad_distance['^-v'].keys="v";

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

  // convert keystack to dirstack
  let cost2=getDirpadCost(keystack, 2);
  let cost25=getDirpadCost(keystack, 25);
  let code_number=Number(code.replace(/^0*(\d+)A$/,'$1'));
  sum2+=cost2*code_number;
  sum25+=cost25*code_number;
};

console.log('sum2', sum2);
console.log('sum25', sum25);

function getPadKeys(from, to) {
  if (from==to) return 'A';
  const padkey=`${from}-${to}`;

  console.log(`getPadKeys`,padkey,':', dirpad_distance[padkey].keys);
  return dirpad_distance[padkey].keys+'A';
};

function getDirpadCost(pad,n,s=0) {
  const cachekey=`${pad}-${n}-${s}`;
  if (cache.has(cachekey)) {
    return cache.get(cachekey);
  };

  if (n==0) return pad.length;
  for (let i=0; i<pad.length; i++) {
    const keyfrom=i>0 ? pad[i-1] : 'A';
    const keyto=pad[i]
    let subkeys='';
    if (keyfrom!=keyto) {
      subkeys=dirpad_distance[`${keyfrom}-${keyto}`].keys;
    }
    subkeys+='A';
    s += getDirpadCost( subkeys, n-1 );
  };

  cache.set(cachekey, s);

  return s;

};

