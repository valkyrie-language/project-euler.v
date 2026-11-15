export function solve(): number {
    let a = 1;
    let b = 2;
    let total = 0;
    while (a < 4_000_000) {
        if (a % 2 === 0) total += a;
        const next = a + b;
        a = b;
        b = next;
    }
    return total;
}
