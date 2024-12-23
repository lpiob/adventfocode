const input = require('fs').readFileSync(0).toString().trim(); 

let networksof3=new Set();
let networks=[];
let p2p_links=new Map();

for (const line of input.split("\n")) {
  const [h1, h2]=line.split("-");
  // h1
  let el=p2p_links.get(h1) || new Set();
  el.add(h2);
  p2p_links.set(h1, el);

  // h2
  el=p2p_links.get(h2) || new Set();
  el.add(h1);
  p2p_links.set(h2, el);
/*
  // networks
  let n1=findNetworksWithHost(networks,h1);
  let n2=findNetworksWithHost(networks,h2);
  if (n1.length<=0 && n2.length<=0) {
    networks.push(new Set([h1, h2]));
  };

  //console.log(n1,n2);

  for (const n of n1) {
    n.add(h2);
  };
  for (const n of n2) {
    n.add(h1);
  };
  */
}

for (let [h1, links] of p2p_links) {
  links=[...links]
  for (let i=0; i<links.length;i++) {
    for (let i2=i+1; i2<links.length; i2++) {
      const h2=links[i];
      const h3=links[i2];
      if (p2p_links.get(h2).has(h3)) {
        const h=[h1,h2,h3].sort();
        const key=`${h[0]}-${h[1]}-${h[2]}`
        networksof3.add(key);
      };
    };
  };
};





console.log(p2p_links);
const cliques = BronKerbosch1(new Set(), new Set(p2p_links.keys()), new Set());
let maxc=new Set();
for (const c of cliques) {
  if (c.size>maxc.size) maxc=c;
};

const password=[...maxc.values()].sort().join(',');

let sum1=0;
for (const el of networksof3) {
  if (el.match(/(^t)|(\-t)/g)) {
    sum1++;
  };
};

console.log("Count of networks of 3 containing t-computers:", sum1);
console.log("Password:", password);


// https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
// algorithm BronKerbosch1(R, P, X) is
function BronKerbosch1(R, P, X) {
  let cliques = [];
    
  //if P and X are both empty then
  //  report R as a maximal clique
  if (P.size <= 0 && X.size <= 0)
    return [new Set(R)];
    
  //for each vertex v in P do
  for (const v of Array.from(P)) {
    // BronKerbosch1(R ⋃ {v}, P ⋂ N(v), X ⋂ N(v))
    const neighbors = p2p_links.get(v)||new Set();
    R.add(v);

    cliques = cliques.concat(
      BronKerbosch1(
        R,
        intersection(P, neighbors),
        intersection(X, neighbors),
        p2p_links
      )
    );
    R.delete(v);
    P.delete(v);
    X.add(v);
  }
  
  return cliques;
}

function intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
}

