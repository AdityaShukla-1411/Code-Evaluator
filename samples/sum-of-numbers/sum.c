// Problem: Code to print the sum of numbers from 1 to N
// Reads an integer N from input and prints the sum 1+2+...+N
#include <stdio.h>

long long sumToN(long long n) {
    return n * (n + 1) / 2;
}

int main() {
    long long n = 10;
    if (scanf("%lld", &n) != 1) {
        n = 10;
    }
    printf("%lld\n", sumToN(n));
    return 0;
}
