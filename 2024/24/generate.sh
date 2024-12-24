#!/bin/bash

set -euxo pipefail
OF='logic.dot'

echo 'digraph logic_gates {
 rankdir=LR;
 node [shape=circle];

 {rank=same; 

'  > $OF;
for I in $(cat input | grep '>' | awk '{print $5}' | egrep "(z)"); do
  echo "${I};" >> $OF;
done;
echo '}' >> $OF;

#echo '{rank=same; '  >> $OF;
#for I in $(cat input | grep '>' | awk '{print $5}' | egrep "(y|x)"); do
#  echo "${I};" >> $OF;
#done;
#echo '}' >> $OF;

sort input | grep '>' | awk '{print "{"$1","$3"} -> "$5" [label="$2"]"}' >> $OF

echo '}' >> $OF

dot -Tsvg logic.dot -o gates.svg
