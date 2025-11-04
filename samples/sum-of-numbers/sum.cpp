// Problem: Code to print the sum of numbers from 1 to N
// Reads an integer N from input and prints the sum 1+2+...+N
#include <bits/stdc++.h>
using namespace std;

long long sumToN(long long n) {
    return n * (n + 1) / 2;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n = 10;
    if (!(cin >> n)) {
        n = 10;
    }
    cout << sumToN(n) << "\n";
    return 0;
}
