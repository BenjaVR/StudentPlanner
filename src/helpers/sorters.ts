export function stringSorter(string1: string, string2: string): -1 | 0 | 1 {
    if (string1 < string2) {
        return -1;
    }
    if (string1 > string2) {
        return 1;
    }
    return 0;
}
