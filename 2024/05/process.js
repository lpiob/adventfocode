const input = require('fs').readFileSync(0).toString().trim(); 

/*
 * The first section specifies the page ordering rules, one per line. 
 * The first rule, 47|53, means that if an update includes both page number 47 and page number 53, 
 * then page number 47 must be printed at some point before page number 53. (
 * 47 doesn't necessarily need to be immediately before 53; other pages are allowed to be between them.)
 */


const [pros, updates] = input.split('\n\n');


let sum_mpn=0;
for (const update of updates.split('\n')) {
  const [check, mpn] = updateAdheresToPros(update, pros);
  if (check) {
    console.log(update, check, mpn);
    sum_mpn+=mpn;
  }
}

console.log("Sum for MPN: ", sum_mpn);

function updateAdheresToPros(update, pros) {
  const pages=update.split(',');
  console.log(pages);

  for (pro of pros.split('\n')) {
    const [n1, n2] = pro.split('|');
    const [in1, in2] = [pages.indexOf(n1), pages.indexOf(n2)];

    if (in1>=0 && in2>=0 && in2<=in1)
      return [false, -1];

  }
  const mpn=Number(pages[Math.floor(pages.length/2)]);
  return [true, mpn];
}
