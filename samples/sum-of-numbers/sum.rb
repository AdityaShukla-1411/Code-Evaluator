# Problem: Code to print the sum of numbers from 1 to N
# Reads an integer N from input and prints the sum 1+2+...+N

def sum_to_n(n)
  n * (n + 1) / 2
end

if __FILE__ == $0
  data = STDIN.read.strip
  n = data.empty? ? 10 : data.to_i
  puts sum_to_n(n)
end
