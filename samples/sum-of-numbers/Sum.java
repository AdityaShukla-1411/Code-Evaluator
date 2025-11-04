// Problem: Code to print the sum of numbers from 1 to N
// Reads an integer N from input and prints the sum 1+2+...+N
import java.util.*;

public class Sum {
    static long sumToN(long n) {
        return n * (n + 1) / 2;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.hasNextLong() ? sc.nextLong() : 10;
        System.out.println(sumToN(n));
        sc.close();
    }
}
