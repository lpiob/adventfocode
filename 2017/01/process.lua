local input = io.read("*all"):gsub("^%s*(.-)%s*$", "%1")
print(input)
local sum=0;
local sum2=0;
local digits={}
for i=1,#input do
  digits[i]=tonumber(string.sub(input, i,i))
end

print("#digits=",#digits)

for i=2,#digits+1,1 do
  if digits[i-1]==digits[(i-1)%#digits+1] then
    sum = sum + digits[i-1]
  end
end
for i=1,#digits do
  --print("v2", i)
  --print(i, (i - 1 + (#digits/2)) %#digits +1, digits[i]==digits[ (i -1+ (#digits/2)) %#digits +1 ])
  if digits[i]==digits[ (i -1 + (#digits/2)) %#digits +1 ] then
    sum2 = sum2 + digits[i]
  end
end

print("sum step1", sum)
print("sum step2", sum2)


