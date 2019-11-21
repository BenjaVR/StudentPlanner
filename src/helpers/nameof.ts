export function nameof<T, S = {}>(field: keyof T, subField?: keyof S | undefined): string {
    if (subField === undefined) {
        return field as string;
    } else {
        return `${field as string}.${subField as string}`;
    }
}
