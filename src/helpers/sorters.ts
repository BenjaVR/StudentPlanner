import moment from "moment";

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

export function dateSorter(date1: moment.Moment | undefined, date2: moment.Moment): -1 | 0 | 1 {
    if (date1 === undefined && date2 === undefined) {
        return 0;
    }
    if (date1 === undefined && date2 !== undefined) {
        return -1;
    }
    if (date1 !== undefined && date2 === undefined) {
        return 1;
    }

    if (date1!.isBefore(date2!)) {
        return -1;
    }
    if (date1!.isAfter(date2)) {
        return 1;
    }
    return 0;
}
