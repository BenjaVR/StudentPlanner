export class StringValidator {
    public static isEmpty(value: string): boolean {
        return value === undefined
            || value.length === 0;
    }
}
