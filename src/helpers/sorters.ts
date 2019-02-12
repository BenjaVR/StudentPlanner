export function stringSorter(string1: string, string2: string): -1 | 0 | 1 {
    if (string1 < string2) {
        return -1;
    }
    if (string1 > string2) {
        return 1;
    }
    return 0;
}

export function sortByProp<T>(a: T | undefined, b: T | undefined, sortProp: keyof T): -1 | 0 | 1 {
    if (a === undefined && b === undefined) {
        return 0;
    }
    if (a === undefined && b !== undefined) {
        return -1;
    }
    if (a !== undefined && b === undefined) {
        return 1;
    }

    if (a![sortProp] < b![sortProp]) {
        return -1;
    }
    if (a![sortProp] > b![sortProp]) {
        return 1;
    }
    return 0;
}
