export function nameof<T>(field: keyof T): string {
    return field as string;
}
