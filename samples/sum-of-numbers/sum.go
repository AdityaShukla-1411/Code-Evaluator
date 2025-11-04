// Problem: Code to print the sum of numbers from 1 to N
// Reads an integer N from input and prints the sum 1+2+...+N
package main

import (
	"bufio"
	"fmt"
	"os"
)

func sumToN(n int64) int64 {
	return n * (n + 1) / 2
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var n int64 = 10
	_, err := fmt.Fscan(in, &n)
	if err != nil {
		n = 10
	}
	fmt.Println(sumToN(n))
}
