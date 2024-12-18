local input = io.read("*all"):gsub("^%s*(.-)%s*$", "%1")

local sum_step1=0
local sum_step2=0

for line in input:gmatch("[^\n]+") do
  local n = {}
  for num in line:gmatch("%S+") do
      table.insert(n, tonumber(num))
  end  

  local max,min = tonumber(n[1]), n[1]

  for _,v in ipairs(n) do
    if v>max then max=v end
    if v<min then min=v end
  end

  local diff = max-min
  sum_step1 = sum_step1 + diff

  for _,n1 in ipairs(n) do
    for _,n2 in ipairs(n) do
      if (n1~=n2) and (n1%n2==0) then
        sum_step2 = sum_step2+n1/n2
      end
    end
  end
end


print("Sum step1:", sum_step1)
print("Sum step2:", sum_step2)
