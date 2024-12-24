#!/bin/bash

set -euxo pipefail
OF='logic.dot'

echo 'digraph logic_gates {
 rankdir=LR;
 node [shape=circle];
'  > $OF;
for I in $(cat input2 | grep '>' | awk '{print $5}' | egrep "^(z)"); do
  echo "${I} [color=red];" >> $OF;
done;
for I in $(cat input2 | grep '>' | awk '{print $5}' | egrep "^(y|x)"); do
  echo "${I} [color=green];" >> $OF;
done;

#echo '{rank=same; '  >> $OF;
#for I in $(cat input2 | grep '>' | awk '{print $5}' | egrep "(y|x)"); do
#  echo "${I};" >> $OF;
#done;
#echo '}' >> $OF;

sort input2 | grep '>' | awk '{print "{"$1","$3"} -> "$5" [label="$2"]"}' >> $OF

echo '}' >> $OF

dot -Tsvg logic.dot -o gates.svg
