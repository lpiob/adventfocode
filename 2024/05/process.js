const input = require('fs').readFileSync(0).toString().trim(); 

/*
 * The first section specifies the page ordering rules, one per line. 
 * The first rule, 47|53, means that if an update includes both page number 47 and page number 53, 
 * then page number 47 must be printed at some point before page number 53. (
 * 47 doesn't necessarily need to be immediately before 53; other pages are allowed to be between them.)
 */


const [pros, updates] = input.split('\n\n');


let sum_mpn=0;
let sum_corrected_mpn=0;

for (const update of updates.split('\n')) {
  const [check, mpn] = updateAdheresToPros(update, pros);
  if (check) { // correctly_ordered_updated
    console.log(update, check, mpn);
    sum_mpn+=mpn;
  } else { // incorrectly_ordered_update
    sum_corrected_mpn+=mpn;
  }
}

console.log("Sum for MPN: ", sum_mpn);
console.log("Sum for Corrected MPN: ", sum_corrected_mpn);

function updateAdheresToPros(update, pros) {
  const pages=update.split(',');

  for (pro of pros.split('\n')) {
    const [n1, n2] = pro.split('|');
    const [in1, in2] = [pages.indexOf(n1), pages.indexOf(n2)];

    if (in1>=0 && in2>=0 && in2<=in1) {
      const mpn=fixOrdering(update);
      return [false, mpn];
    }

  }
  const mpn=Number(pages[Math.floor(pages.length/2)]);
  return [true, mpn];
}

function fixOrdering(update) {
  const pages=update.split(',');
  console.log('before sort', pages);
  pages.sort(sortWithPros);
  console.log('after sort', pages);

  const mpn=Number(pages[Math.floor(pages.length/2)]);
  return mpn;
}

function sortWithPros(a,b) {
  a=Number(a);
  b=Number(b);
  for (pro of pros.split('\n')) {
    let [n1, n2] = pro.split('|');
    n1=Number(n1);
    n2=Number(n2);

    if (n1==a && n2==b) {
      return -1;
    } else if (n1==b && n2==a) {
      return 1;
    } else {
      //console.log("v3");
      //return 0;
    };

  }
  return 0;
}
