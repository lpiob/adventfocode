const input = require('fs').readFileSync(0).toString().trim(); 

let networksof3=new Set();
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
console.log(networksof3);

let sum1=0;
for (const el of networksof3) {
  if (el.match(/(^t)|(\-t)/g)) {
    sum1++;
  };
};

console.log("Count of networks of 3 containing t-computers:", sum1);

