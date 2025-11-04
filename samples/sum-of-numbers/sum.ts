// Problem: Code to print the sum of numbers from 1 to N
// Reads an integer N from input and prints the sum 1+2+...+N

export function sumToN(n: number): number {
  return (n * (n + 1)) / 2;
}

if (require.main === module) {
  const fs = require("fs");
  const data = fs.readFileSync(0, "utf-8").trim();
  const n = data ? parseInt(data, 10) : 10;
  console.log(sumToN(n));
}
