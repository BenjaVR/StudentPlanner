export function singleOrPlural(count: number, single: string, plural: string): string {
    if (count === 1) {
        return single;
    }
    return plural;
}
