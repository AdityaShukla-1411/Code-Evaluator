# Problem: Code to print the sum of numbers from 1 to N
# Reads an integer N from input and prints the sum 1+2+...+N

def sum_to_n(n: int) -> int:
    return n * (n + 1) // 2

if __name__ == "__main__":
    import sys
    data = sys.stdin.read().strip()
    n = int(data) if data else 10
    print(sum_to_n(n))
